import { InjectionToken } from '@angular/core';
import { ConsoleLoggerService } from './console-logger.service';
import { environment } from '../../environments/environment';

export enum LogLevel {
    ALL = 0,
    DEBUG = 1,
    INFO = 2,
    WARN = 3,
    ERROR = 4,
    OFF = 5,
    TRACE = 6
}

/**
 * @author Geremia Nappo <ge.nappo@almaviva.it>
 * @version 1.0.0
 * @summary Interfaccia di base logger
 */
export interface Logger {
    level: LogLevel;
    debug: (message?: string, ...params: any[]) => void;
    info: (message?: string, ...params: any[]) => void;
    warn: (message?: string, ...params: any[]) => void;
    error: (message?: string, ...params: any[]) => void;
    trace: (message?: string, ...params: any[]) => void;
}

export const LOGGER_SERVICE = new InjectionToken<Logger>('Logger Service', {
    providedIn: 'root',
    factory: () => new ConsoleLoggerService(
      environment.production ? LogLevel.ERROR : LogLevel.INFO
    )
});
