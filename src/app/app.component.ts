import { Component, Inject } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BROWSER_STORAGE } from './core/browser-storage.service';
import { Logger, APP_LOGGER } from './core/logger';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'angular-recipes';
  langChange$: Observable<string>;

  constructor(
    @Inject(BROWSER_STORAGE) private readonly browserStorageService: Storage,
    private readonly langService: TranslocoService,
    @Inject(APP_LOGGER) logger: Logger
  ) {
    logger.debug('debug e', { d: 'kqwe'});
    logger.warn('warn e', { d: 'kqwe'});
    logger.error('error e', { d: 'kqwe'});

    this.langChange$ = this.langService.langChanges$
      .pipe(tap(lang => this.browserStorageService.setItem('lang', lang)));
  }

}
