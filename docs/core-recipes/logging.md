# Logging

Definiamo un'interfaccia

```typescript
export interface Logger {
    level: LogLevel;
    debug: (message?: string, ...params: any[]) => void;
    info: (message?: string, ...params: any[]) => void;
    warn: (message?: string, ...params: any[]) => void;
    error: (message?: string, ...params: any[]) => void;
    trace: (message?: string, ...params: any[]) => void;
}
```

ed una sua implementazione

```typescript
@Injectable()
export class ConsoleLoggerService implements Logger {

  constructor(public level: LogLevel = LogLevel.ALL) { }

  debug(message?: string, ...params: any[]) {
    this.invokeConsoleMethod(LogLevel.DEBUG, message, params);
  }

  info(message?: string, ...params: any[]) {
    this.invokeConsoleMethod(LogLevel.INFO, message, params);
  }

  warn(message?: string, ...params: any[]) {
    this.invokeConsoleMethod(LogLevel.WARN, message, params);
  }

  error(message?: string, ...params: any[]) {
    this.invokeConsoleMethod(LogLevel.ERROR, message, params);
  }

  trace(message?: string, ...params: any[]) {
    this.invokeConsoleMethod(LogLevel.TRACE, message, params);
  }

  private invokeConsoleMethod(level: LogLevel, message: string, args?: any): void {
    let logFn = () => { };
    if (this.isLevelEnabled(level)) {
      logFn = (console)[LogLevel[level].toLowerCase()] || console.log;
    }
    logFn.call(console, message, args);
  }

  private isLevelEnabled(level: LogLevel): boolean {
    return (this.level === LogLevel.ALL ||
      (level >= this.level && level !== LogLevel.OFF));
  }

}
```

tramite [factory](https://en.wikipedia.org/wiki/Factory_method_pattern)  costruiamo un'istanza e la rendiamo disponibile nel root injector

```typescript
export const LOGGER_SERVICE = new InjectionToken<Logger>('Logger Service', {
    providedIn: 'root',
    factory: () => new ConsoleLoggerService(
      environment.production ? LogLevel.ERROR : LogLevel.INFO
    )
});
```

?> :warning: &nbsp; Scegliere con cura il livello di log: evitiamo un logging troppo verboso in ambiente di produzione

```typescript
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    @Inject(LOGGER_SERVICE) private readonly logger: Logger,
  ) {
    this.logger.warn('Juve M3rda!');
    this.logger.info('Forza Napoli Sempre!');
  }

}
```

Tramite un http interceptor, che sfrutta il logger appena definito, possiamo profilare le richieste http.<br>Si tratta certamente di una soluzione banale, ma che può comunque risultare utile.

?> :open_book: &nbsp; Il [Profiling](https://en.wikipedia.org/wiki/Profiling_(computer_programming)) è una forma di analisi dinamica del software che, misurando la complessità spaziale, temporale, di trasmissione etc dei suoi algoritmi, fornisce informazioni utili al processo di ottimizzazione del software stesso.

```typescript
@Injectable()
export class ProfilerInterceptor implements HttpInterceptor {

  constructor(
    @Inject(LOGGER_SERVICE) private readonly logger: Logger
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const started = Date.now();
    let status: string;
    return next.handle(req)
        .pipe(
            tap(
                (event: HttpEvent<any>) => status = event instanceof HttpResponse ? event.statusText : null,
                (error: HttpErrorResponse) => status = error.statusText
            ),
            finalize(() => {
                const elapsed = Date.now() - started;
                this.logger.info(`${req.method} - ${req.urlWithParams}: ${status}, took ${elapsed}ms`);
            })
        );
  }

}
```

Da notare che rispettando i principi [SOLID](https://en.wikipedia.org/wiki/SOLID), diviene semplice manutenere ed estendere il codice: possiamo infatti, senza alterare i client, fornire un'implementazione del logger per l'invio dei messaggi ad un server, aggiungere i colori alla stampa in console o qualsiasi altra cosa ci passi per la mente. :sunglasses:

```typescript
export let LOGGER_SERVICE = new InjectionToken<Logger>('Logger Service', {
    providedIn: 'root',
    factory: () => environment.production ?
      // implementa invio messaggi ad un server
      new WebApiLoggerService(LogLevel.ERROR) 
      // estende ConsoleLoggerService aggiungendo uso colori
      new ColorfulConsoleLoggerService(LogLevel.ALL) 
    )
});
```
