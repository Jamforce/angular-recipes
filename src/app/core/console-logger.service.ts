import { Injectable } from '@angular/core';
import { Logger, LogLevel } from './logger';

/**
 * @author Geremia Nappo <ge.nappo@almaviva.it>
 * @version 1.0.0
 * @summary Service per il logging in console
 */
@Injectable()
export class ConsoleLoggerService implements Logger {

  constructor(public level: LogLevel = LogLevel.ALL) { }

  debug(message?: string, ...params: any[]) {
    this.invokeConsoleMethod(LogLevel.DEBUG, message, params);
  }

  info(message?: string, ...params: any[]) {
    this.invokeConsoleMethod(LogLevel.INFO, message, params);
  }

  warn(message?: string, ...params: any[]) {
    this.invokeConsoleMethod(LogLevel.WARN, message, params);
  }

  error(message?: string, ...params: any[]) {
    this.invokeConsoleMethod(LogLevel.ERROR, message, params);
  }

  trace(message?: string, ...params: any[]) {
    this.invokeConsoleMethod(LogLevel.TRACE, message, params);
  }

  private invokeConsoleMethod(level: LogLevel, message: string, args?: any): void {
    let logFn = () => { };
    if (this.isLevelEnabled(level)) {
      logFn = (console)[LogLevel[level].toLowerCase()] || console.log;
    }
    logFn.call(console, message, args);
  }

  private isLevelEnabled(level: LogLevel): boolean {
    return (this.level === LogLevel.ALL ||
      (level >= this.level && level !== LogLevel.OFF));
  }

}
