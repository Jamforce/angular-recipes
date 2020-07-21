import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import * as R from 'ramda';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';
import { AuthConfiguration, AUTH_CONFIG } from './auth.config';
import { AuthProvider, AUTH_PROVIDER } from './auth-provider';
import { BROWSER_STORAGE } from '../core/browser-storage.service';
import { environment } from '../../environments/environment';

const capitalize = R.replace(/^./, R.toUpper);

export interface User {
  id: number;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  accessToken: Token;
  profile: any;
}

export interface Token {
  access_token: string;
  token_type: string;
  expires_in: number;
  resource: string;
  refresh_token: string;
  refresh_token_expires_in: number;
  id_token: string;
}


/**
 * @author Geremia Nappo <ge.nappo@almaviva.it>
 * @version 1.0.0
 * @summary Service per l'autenticazione
 */
@Injectable()
export class AuthService {

  private readonly currentUserSubject: BehaviorSubject<User>;
  public currentUser$: Observable<User>;

  constructor(
    @Inject(AUTH_PROVIDER) private readonly authProvider: AuthProvider,
    @Inject(AUTH_CONFIG) private readonly config: AuthConfiguration,
    @Inject(BROWSER_STORAGE) private readonly browserStorageService: Storage,
    private readonly http: HttpClient) {

    const user: User = this.deserialize(browserStorageService.get(config.session_storage_key));
    this.currentUserSubject = new BehaviorSubject<User>(user);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): Observable<boolean> {
    return this.currentUser$.pipe(
      map((user: User) => user ? !!user.accessToken : false)
    );
  }

  getClaims(): any {
    return this.currentUser$.pipe(map((user) => user.profile));
  }

  getHeaders() {
    return of(this.deserialize(this.browserStorageService.get('token')))
      .pipe(
        map((token: Token) => !token ? {} : {
          Authorization: `${capitalize(token.token_type)} ${token.access_token}`
        })
      );
  }

  startAuthentication() {
    return this.authProvider.signinRedirect();
  }

  completeAuthentication() {
    return this.authProvider.signinRedirectCallback()
      .pipe(
        tap((token: Token) => this.browserStorageService.set('token', this.serialize(token))),
        switchMap(token => this.getUser())
      );
  }

  logout() {
    this.browserStorageService.remove(this.config.session_storage_key);
    this.currentUserSubject.next(null);
  }

  public getUser() {
    return this.http.get(environment.baseUrl + '/api/user')
      .pipe(
        tap((user: any) => {
          this.browserStorageService.set(this.config.session_storage_key, this.serialize(user));
          this.currentUserSubject.next(user);
        }),
      );
  }

  private serialize(obj: any) {
    return JSON.stringify(obj);
  }

  private deserialize(obj: any) {
    return JSON.parse(obj);
  }

}
