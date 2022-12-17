import { Entry, Logging, Sink } from "@google-cloud/logging-min";
import { GCP_PROJECT_ID, ONE_HOUR_IN_MS, ONE_MIN_IN_MS } from "@gs/constants";
import { LogSeverity } from "@gs/constants/logs-constants";
import { googleServiceAccount } from "@gs/firebase/credentials";
import invariant from "@gs/utils/invariant";
import { boolean } from "zod";

import { fetchCachedKey, deleteCachedKey } from "./cache.server";

const cacheKey = "logger";
function createCacheKey(...texts: string[]) {
  return [cacheKey, ...texts].filter(Boolean).join("/");
}

function createGCPLogging(): Logging | undefined {
  try {
    return new Logging({
      projectId: GCP_PROJECT_ID,
      credentials: googleServiceAccount(),
    });
  } catch {
    return undefined;
  }
}

export async function getLoggers(): Promise<Sink[]> {
  const loggers = (await createGCPLogging()?.getLogs())?.[0] || [];

  return loggers.filter((logger) => !logger.name.includes("googleapis.com"));
}

export async function getLoggerNames(): Promise<string[]> {
  return fetchCachedKey(
    createCacheKey("::logger-names::"),
    async () => (await getLoggers()).map((logger) => logger.name),
    { ttl: ONE_HOUR_IN_MS },
  );
}

export interface LogItem {
  data: string;
  severity?: LogSeverity | null;
  name?: string;
  timestamp?: string;
}

export interface GetLogsOptions {
  limit?: number;
  filter?: string;
  severity?: LogSeverity;
}

export async function getLogs(
  loggerName: string,
  options: GetLogsOptions = {},
): Promise<LogItem[]> {
  const { limit = 10, filter: filterText = "", severity } = options;

  const logger = createGCPLogging()?.log(loggerName);
  invariant(logger, `Logger with name "${loggerName}" not found.`);

  const filter = [filterText, severity ? `severity = ${severity}` : ""]
    .filter(Boolean)
    .join(" AND ");

  const [entries] = await fetchCachedKey(
    createCacheKey(loggerName, filter, limit.toString()),
    () => logger.getEntries({ pageSize: limit, filter }),
    { ttl: ONE_MIN_IN_MS },
  );

  return entries
    .map(transformLogEntryToLogItem)
    .filter((log) => typeof log.data === "string");
}

function transformLogEntryToLogItem(entry: Entry): LogItem {
  const { severity, logName, timestamp: _ts } = entry.metadata;
  const timestamp = new Date(Number(_ts?.valueOf())).toISOString();

  return {
    data: entry.data,
    severity: severity as LogSeverity,
    name: logName?.replace(`projects/${GCP_PROJECT_ID}/logs/`, ""),
    timestamp,
  };
}

export async function clearLogCache(name?: string) {
  deleteCachedKey(createCacheKey(name || ""));
}
