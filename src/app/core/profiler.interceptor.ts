import { Injectable, Inject } from '@angular/core';
import {
    HttpInterceptor, HttpRequest,
    HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';

import { Logger, LOGGER_SERVICE } from './logger';


/**
 * @author Geremia Nappo <ge.nappo@almaviva.it>
 * @version 1.0.0
 * @summary Interceptor per profiling richieste http
 */
@Injectable()
export class ProfilerInterceptor implements HttpInterceptor {

    constructor(
        @Inject(LOGGER_SERVICE) private readonly logger: Logger
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const started = Date.now();
        let status: string;
        return next.handle(req)
            .pipe(
                tap(
                    (event: HttpEvent<any>) => status = event instanceof HttpResponse ? event.statusText : null,
                    (error: HttpErrorResponse) => status = error.statusText
                ),
                finalize(() => {
                    const elapsed = Date.now() - started;
                    this.logger.trace(`${req.method} - ${req.urlWithParams}: ${status}, took ${elapsed}ms`);
                })
            );
    }

}
