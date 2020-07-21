import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tap, catchError } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-auth-callback',
  templateUrl: 'auth-callback.component.html'
})

export class AuthCallbackComponent implements OnInit {

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) { }

  ngOnInit() {
    this.authService.completeAuthentication()
      .pipe(
        tap(_ => this.router.navigate(['home'])),
        catchError(error => this.router.navigate(['autenticazione']))
      )
      .subscribe();
  }

}
