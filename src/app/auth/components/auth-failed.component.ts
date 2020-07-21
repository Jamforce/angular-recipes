import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-auth-failed',
  templateUrl: 'auth-failed.component.html'
})

export class AuthFailedComponent implements OnInit {

  constructor(private readonly authService: AuthService) { }

  ngOnInit() { }

  onClickAccedi() {
    this.authService.startAuthentication();
  }

}
