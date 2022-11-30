import { type Log, Logging } from "@google-cloud/logging-min";

// See: https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#logseverity
export enum LogSeverity {
  DEFAULT = "DEFAULT",
  DEBUG = "DEBUG",
  INFO = "INFO",
  NOTICE = "NOTICE",
  WARNING = "WARNING",
  ERROR = "ERROR",
  CRITICAL = "CRITICAL",
  ALERT = "ALERT",
  EMERGENCY = "EMERGENCY",
}

export default class Logger {
  #name: string;
  #logInstance: Log;

  constructor(name: string) {
    this.#name = name;
    this.#logInstance = new Logging({ projectId: "guptasiddhant-com" }).log(
      name,
    );
  }

  #createLoggerWithSeverity = (severity: LogSeverity, metadata?: object) => {
    return async (text: string) => {
      try {
        return await this.#logInstance.write(
          this.#logInstance.entry(
            {
              resource: { type: "global" },
              severity,
              ...metadata,
            },
            text,
          ),
        );
      } finally {
        console.log(`[${severity}] ${this.#name}:`, text);
      }
    };
  };

  /** The log entry has no assigned severity level. */
  log = this.#createLoggerWithSeverity(LogSeverity.DEFAULT);
  /** Debug or trace information */
  debug = this.#createLoggerWithSeverity(LogSeverity.DEBUG);
  /** Routine information, such as ongoing status or performance. */
  info = this.#createLoggerWithSeverity(LogSeverity.INFO);
  /** Normal but significant events, such as start up, shut down, or a configuration change. */
  notice = this.#createLoggerWithSeverity(LogSeverity.NOTICE);
  /** Warning events might cause problems. */
  warn = this.#createLoggerWithSeverity(LogSeverity.WARNING);
  /** Error events are likely to cause problems. */
  error = this.#createLoggerWithSeverity(LogSeverity.ERROR);
  /** Critical events cause more severe problems or outages. */
  critical = this.#createLoggerWithSeverity(LogSeverity.CRITICAL);
  /** A person must take an action immediately. */
  alert = this.#createLoggerWithSeverity(LogSeverity.ALERT);
  /** One or more systems are unusable. */
  emergency = this.#createLoggerWithSeverity(LogSeverity.EMERGENCY);

  get instance() {
    return this.#logInstance;
  }

  logRequest = (request: Request) => {
    return this.#createLoggerWithSeverity(LogSeverity.NOTICE, {
      httpRequest: request,
    })(`New Request '${request.method}' - ${request.url}`);
  };
}

export const appLogger = new Logger("App");
