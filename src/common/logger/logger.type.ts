export enum LogLevel {
  Emergency = 'emergency', // One or more systems are unusable.
  Fatal = 'fatal', // A person must take an action immediately
  Error = 'error', // Error events are likely to cause problems
  Warn = 'warn', // Warning events might cause problems in the future and deserve eyes
  Info = 'info', // Routine information, such as ongoing status or performance
  Debug = 'debug', // Debug or trace information
}

export interface Log {
  timestamp: number; // Unix timestamp
  level: LogLevel; // Log level
  message: string; // Log message
  data: LogData; // Log data
}

export interface LogData {
  sourceClass?: string; // Classname of the source
  error?: Error; // Error object
  props?: NodeJS.Dict<any>; // Additional custom properties
}

export const LoggerBaseKey = Symbol();
export const LoggerKey = Symbol();

export default interface Logger {
  log(
    level: LogLevel,
    message: string | Error,
    data?: LogData,
    profile?: string,
  ): void;
  debug(message: string, data?: LogData, profile?: string): void;
  info(message: string, data?: LogData, profile?: string): void;
  warn(message: string | Error, data?: LogData, profile?: string): void;
  error(message: string | Error, data?: LogData, profile?: string): void;
  fatal(message: string | Error, data?: LogData, profile?: string): void;
  emergency(message: string | Error, data?: LogData, profile?: string): void;
  startProfile(id: string): void;
}
