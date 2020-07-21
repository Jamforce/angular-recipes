import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { AUTH_CONFIG, AuthConfiguration } from './auth.config';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { AuthErrorInterceptor } from './auth-error.interceptor';
import { JwtInterceptor } from './jwt.interceptor';
import { AuthFailedComponent } from './components/auth-failed.component';
import { AuthCallbackComponent } from './components/auth-callback.component';


@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [AuthCallbackComponent, AuthFailedComponent],
    exports: [AuthCallbackComponent, AuthFailedComponent]
})
export class AuthModule {

    static forRoot(config: AuthConfiguration): ModuleWithProviders {
        return {
            ngModule: AuthModule,
            providers: [
                {
                    provide: AUTH_CONFIG,
                    useValue: config
                },
                AuthGuard,
                AuthService,
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: JwtInterceptor,
                    multi: true,
                },
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: AuthErrorInterceptor,
                    multi: true,
                }
            ]
        };
    }

    static forChild(): ModuleWithProviders {
        return {
            ngModule: AuthModule
        };
    }

}
