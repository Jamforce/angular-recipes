import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

/**
 * @author Geremia Nappo <ge.nappo@almaviva.it>
 * @version 1.0.0
 * @summary Interceptor per errori di authenticazione/autorizzazione (status 401/403)
 */
@Injectable()
export class AuthErrorInterceptor implements HttpInterceptor {

  constructor(
    private readonly authenticationService: AuthService,
    private readonly router: Router
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(error => {
      if (error.status === 401) {
        this.authenticationService.logout();
        this.router.navigate(['autenticazione']);
      }

      return throwError(error);
    }));
  }
}
