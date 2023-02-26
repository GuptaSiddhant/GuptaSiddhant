import { Redis as UpstashRedis } from "@upstash/redis";
import type { SetCommandOptions } from "@upstash/redis/types/pkg/commands/set";

import parsedEnv from "@gs/env";

export default class Redis {
  static get client() {
    const token = parsedEnv.UPSTASH_REDIS_REST_TOKEN;
    const url = parsedEnv.UPSTASH_REDIS_REST_URL;

    return new UpstashRedis({ url, token });
  }

  static async get<T>(key: string): Promise<T | null> {
    return this.client.get<T>(key);
  }

  static async set<T>(
    key: string,
    value: T,
    expireInMs: number,
  ): Promise<boolean> {
    const opts: SetCommandOptions | undefined = expireInMs
      ? { px: expireInMs }
      : undefined;
    const result = await this.client.set<T>(key, value, opts);

    return !!result;
  }

  static async has(key: string): Promise<boolean> {
    const result = await this.client.exists(key);

    return result > 0;
  }

  static async delete(key: string): Promise<boolean> {
    const result = await this.client.del(key);

    return result > 0;
  }

  static async clear(): Promise<void> {
    await this.client.flushall();
  }

  static async keys(pattern: string = "*"): Promise<string[]> {
    return this.client.keys(pattern);
  }
}
