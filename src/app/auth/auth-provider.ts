import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface AuthProvider {

    signinRedirect(): void | Observable<any>;
    signinRedirectCallback(): Observable<any>;

}

export const AUTH_PROVIDER = new InjectionToken<AuthProvider>('Authentication Provider');
