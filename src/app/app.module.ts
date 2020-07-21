import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './auth/auth.module';
import { TranslocoRootModule } from './transloco-root.module';
import { AppComponent } from './app.component';
import { ErrorInterceptor } from './core/error.interceptor';
import { LocaleInterceptor } from './core/locale.interceptor';
import { ProfilerInterceptor } from './core/profiler.interceptor';
import { SharedModule } from './shared/shared.module';
import { environment } from '../environments/environment';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AuthModule.forRoot({
      session_storage_key: environment.session_storage_key,
    }),

    HttpClientModule,
    SharedModule,
    TranslocoRootModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ProfilerInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LocaleInterceptor,
      multi: true,
    },
    {
      provide: LOCALE_ID,
      useValue: environment.locale,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
