import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';

/**
 * @author Geremia Nappo <ge.nappo@almaviva.it>
 * @version 1.0.0
 * @summary Interceptor per invio preferenza locale
 */
@Injectable()
export class LocaleInterceptor implements HttpInterceptor {

  constructor(private readonly localeService: TranslocoLocaleService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: { 'Accept-Language': this.localeService.getLocale() }
    });
    return next.handle(request);
  }

}
