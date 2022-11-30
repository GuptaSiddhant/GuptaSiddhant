import Logger from "@gs/service/logger.server";

export const adminLogger = new Logger("Admin");

export function createAdminLogger(prefix: string) {
  return new Logger(`Admin [${prefix}]:`);
}
