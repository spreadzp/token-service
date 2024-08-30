import { Inject, Injectable, Scope } from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';
import Logger, { LogData, LogLevel, LoggerBaseKey } from './logger.type';

@Injectable({ scope: Scope.TRANSIENT })
export default class LoggerService implements Logger {
  private sourceClass: string;

  public constructor(
    @Inject(LoggerBaseKey) private logger: Logger,
    @Inject(INQUIRER) parentClass: object,
  ) {
    // Set the source class from the parent class
    this.sourceClass = parentClass?.constructor?.name;
  }

  public log(
    level: LogLevel,
    message: string | Error,
    data?: LogData,
    profile?: string,
  ) {
    return this.logger.log(level, message, this.getLogData(data), profile);
  }

  public debug(message: string, data?: LogData, profile?: string) {
    return this.logger.debug(message, this.getLogData(data), profile);
  }

  public info(message: string, data?: LogData, profile?: string) {
    return this.logger.info(message, this.getLogData(data), profile);
  }

  public warn(message: string | Error, data?: LogData, profile?: string) {
    return this.logger.warn(message, this.getLogData(data), profile);
  }

  public error(message: string | Error, data?: LogData, profile?: string) {
    return this.logger.error(message, this.getLogData(data), profile);
  }

  public fatal(message: string | Error, data?: LogData, profile?: string) {
    return this.logger.fatal(message, this.getLogData(data), profile);
  }

  public emergency(message: string | Error, data?: LogData, profile?: string) {
    return this.logger.emergency(message, this.getLogData(data), profile);
  }

  private getLogData(data?: LogData): LogData {
    return {
      ...data,
      sourceClass: data?.sourceClass || this.sourceClass,
    };
  }

  public startProfile(id: string) {
    this.logger.startProfile(id);
  }
}
