import { Logger } from "tslog"

export function createLogger(name: string) {
  return new Logger({
    name,
    displayDateTime: false,
    displayFunctionName: false,
    displayInstanceName: false,
    displayFilePath: "hidden",
  })
}

export const appLogger = createLogger("App")
