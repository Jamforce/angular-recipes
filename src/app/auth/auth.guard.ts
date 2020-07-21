import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { tap, take } from 'rxjs/operators';

/**
 * @author Geremia Nappo <ge.nappo@almaviva.it>
 * @version 1.0.0
 * @summary Guard per Routes che necessitano di autenticazione avvenuta
 */
@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly authenticationService: AuthService,
    private readonly router: Router,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authenticationService.isAuthenticated()
    .pipe(
      take(1),
      tap(isAuthenticated => {
        if (!isAuthenticated) {
          this.authenticationService.startAuthentication();
        }
      })
    );
  }

}
