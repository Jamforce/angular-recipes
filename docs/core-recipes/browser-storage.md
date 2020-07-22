# Browser Storage

Definiamo la [factory](https://en.wikipedia.org/wiki/Factory_method_pattern) con cui istanziare il nostro service e renderlo disponibile nel root injector

```typescript
export const BROWSER_STORAGE = new InjectionToken<Storage>('Browser Storage', {
  providedIn: 'root',
  factory: () => sessionStorage
});
```

?> :open_book: &nbsp; La [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) consente l'utilizzo del meccanismo con cui i browser memorizzano informazioni di tipo chiave/valore


```typescript
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  langChange$: Observable<string>;

  constructor(
    @Inject(BROWSER_STORAGE) private readonly browserStorageService: Storage,
    private readonly langService: TranslocoService) {
    this.langChange$ = this.langService.langChanges$
      .pipe(tap(lang => this.browserStorageService.setItem('lang', lang)));
  }

}
```

Se avessimo invece necessità di una differente implementazione per far fronte ad un caso particolare? Nulla di complicato, ci basterà adoperare il decorator @Self per indicare al framework di utilizzare l'injector locale al @Component. :sunglasses:

```typescript
@Component({
  selector: 'app-feature',
  template: `
    <h1>Browser Storage</h1>
    <button (click)="save()">Salva in Local Storage</button>
  `,
  styleUrls: ['./feature.component.scss'],
  providers: [
    { provide: BROWSER_STORAGE, useFactory: () => localStorage }
  ]
})
export class FeatureComponent {

  constructor(
    @Self() @Inject(BROWSER_STORAGE) private readonly browserStorageService: Storage
  ) { }

  save() {
    this.browserStorageService.setItem('test', 'Local Storage');
  }

}
```

:raising_hand_man: Per quale motivo introdurre l'interfaccia Storage ed un provider piuttosto che non scrivere direttamente localStorage (o sessionStorage)?<br/>
La risposta è che così facendo aderiamo al principio della [Dependency Inversion](https://en.wikipedia.org/wiki/Dependency_inversion_principle) (SOLI**D**), che afferma in sintesi che in un software i componenti a più alto livello (client) non devono dipendere da componenti a basso livello (service), ma da astrazioni (interfacce) concretizzate (implementate) da quest'ultimi.

?> :open_book: &nbsp; [SOLID](https://en.wikipedia.org/wiki/SOLID) è un acronimo che si riferisce a 5 importanti principi del mondo della programmazione orientata agli oggetti: si tratta di linee guida per lo sviluppo di software leggibile, estendibile e manutenibile. 


