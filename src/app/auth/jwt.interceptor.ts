import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap, map, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

/**
 * @author Geremia Nappo <ge.nappo@almaviva.it>
 * @version 1.0.0
 * @summary Interceptor per invio token JWT
 */
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private readonly authenticationService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authenticationService.getHeaders()
      .pipe(
        take(1),
        map((headers: any) => !headers ?
          request : request.clone({
            setHeaders: headers,
            withCredentials: true
          })
        ),
        switchMap((req) => next.handle(req))
      );
  }

}
