import { InjectionToken } from '@angular/core';

export interface AuthConfiguration {
    session_storage_key: string;
}

export const AUTH_CONFIG = new InjectionToken<AuthConfiguration>('Authentication Configuration');
