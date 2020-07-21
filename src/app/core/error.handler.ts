import { ErrorHandler, Injectable, Inject } from '@angular/core';
import { APP_LOGGER } from './logger';

@Injectable()
export class AppErrorHandler implements ErrorHandler {

  constructor(
    @Inject(APP_LOGGER) private readonly logger: LoggerService
  ) {}

  handleError(error: any) {
    this.logger.error(error);
  }

}
