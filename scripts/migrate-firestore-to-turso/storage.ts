import {
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import { initFirebase, STORAGE_BUCKET } from "./firestore.ts";

export interface CopyStorageOptions {
  dryRun: boolean;
  /** Only copy objects whose key starts with this prefix. */
  prefix?: string;
  concurrency?: number;
}

export interface CopyStorageResult {
  total: number;
  copied: number;
  skipped: number;
  failed: number;
  bytes: number;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

/**
 * Streams every object of the Firebase Storage bucket to R2, keeping object
 * keys. Objects already in R2 with the same size are skipped, so the run is
 * resumable/idempotent. Source objects are never modified.
 */
export async function copyStorageToR2({
  dryRun,
  prefix,
  concurrency = 4,
}: CopyStorageOptions): Promise<CopyStorageResult> {
  await initFirebase();
  const { getStorage } = await import("firebase-admin/storage");
  const bucket = getStorage().bucket(STORAGE_BUCKET);

  // In a dry run R2 is only read from when credentials are present.
  const hasR2 = Boolean(process.env.R2_ACCOUNT_ID);
  const r2Bucket = dryRun && !hasR2 ? "" : requireEnv("R2_BUCKET");
  const s3 =
    dryRun && !hasR2
      ? undefined
      : new S3Client({
          region: "auto",
          endpoint: `https://${requireEnv("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
          credentials: {
            accessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
            secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY"),
          },
        });

  const [files] = await bucket.getFiles(prefix ? { prefix } : {});
  const objects = files.filter((file) => !file.name.endsWith("/"));

  const result: CopyStorageResult = {
    total: objects.length,
    copied: 0,
    skipped: 0,
    failed: 0,
    bytes: 0,
  };

  const queue = [...objects];
  const worker = async () => {
    for (let file = queue.shift(); file; file = queue.shift()) {
      const key = file.name;
      const size = Number(file.metadata.size ?? 0);
      try {
        if (s3 && (await existsWithSize(s3, r2Bucket, key, size))) {
          result.skipped++;
          console.log(`  skip  ${key} (already in R2)`);
          continue;
        }
        if (dryRun) {
          result.copied++;
          result.bytes += size;
          console.log(`  would copy ${key} (${size} bytes)`);
          continue;
        }
        await s3!.send(
          new PutObjectCommand({
            Bucket: r2Bucket,
            Key: key,
            Body: file.createReadStream(),
            ContentLength: size,
            ContentType: file.metadata.contentType,
            CacheControl: file.metadata.cacheControl,
            ContentDisposition: file.metadata.contentDisposition,
            ContentEncoding: file.metadata.contentEncoding,
          }),
        );
        result.copied++;
        result.bytes += size;
        console.log(`  copy  ${key} (${size} bytes)`);
      } catch (error) {
        result.failed++;
        console.error(`  FAIL  ${key}: ${(error as Error).message}`);
      }
    }
  };
  await Promise.all(Array.from({ length: concurrency }, worker));

  return result;
}

async function existsWithSize(
  s3: S3Client,
  bucket: string,
  key: string,
  size: number,
) {
  try {
    const head = await s3.send(
      new HeadObjectCommand({ Bucket: bucket, Key: key }),
    );
    return head.ContentLength === size;
  } catch (error) {
    const status = (error as any)?.$metadata?.httpStatusCode;
    if (status === 404 || (error as Error).name === "NotFound") return false;
    throw error;
  }
}
