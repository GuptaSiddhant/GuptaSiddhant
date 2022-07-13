import { createLogger } from "@gs/service/logger.server"

export const adminLogger = createLogger("Admin")

export function createAdminLogger(prefix: string) {
  return createLogger("Admin", `${prefix}:`)
}
