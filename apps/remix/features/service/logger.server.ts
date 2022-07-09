import { Logger } from "tslog"

export function createLogger(name: string, prefix?: string) {
  return new Logger({
    name,
    displayDateTime: false,
    displayFunctionName: false,
    displayInstanceName: false,
    displayFilePath: "hidden",
    prefix: prefix ? [prefix] : undefined,
  })
}

export const appLogger = createLogger("App")
