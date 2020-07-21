# Rest Services

Seguendo il principio [Don't repeat yourself](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) (DRY), definiamo un'interfaccia con l'utilizzo dei Generics

```typescript
export interface RestService<T> {
  readonly resourceName: string;
  create(resource: T): Observable<T>;
  delete(id: number | string): Observable<number | string>;
  getAll(params?: QueryParams | string): Observable<CollectionModel<T>>;
  getById(id: number | string): Observable<T>;
  update(id: number | string, resource: Partial<T>): Observable<T>;
  upsert(resource: T): Observable<T>;
}
```

?> :open_book: &nbsp; La metodologia **DRY** ci permette di risparmiare tempo e fatica, produrre un codice più semplice da manutenere e con meno probabilità  di riscontrare anomalie.

e la sua implementazione tenendo conto dell'utilizzo dei verbi http in un stile architetturale [REST](https://en.wikipedia.org/wiki/Representational_state_transfer)

```typescript
export class RestServiceImpl<T> implements RestService<T> {

  protected resourceUrl: string;

  constructor(
    public readonly resourceName: string,
    protected readonly http: HttpClient,
    config?: any
  ) {
    const { root = 'api' } = config || {};
    this.resourceUrl = this.generateHttpUrl(resourceName, root);
  }

  create(resource: T): Observable<T> {
    return this.http.post<T>(`${this.resourceUrl}`, resource);
  }

  delete(id: string | number): Observable<string | number> {
    return this.http.delete(`${this.resourceUrl}/${id}`)
      .pipe(map(_ => id));
  }

  getAll(queryParams?: QueryParams | string): Observable<CollectionModel<T>> {
    const qParams = typeof queryParams === 'string' ? { fromString: queryParams } : { fromObject: queryParams };
    const params = new HttpParams(qParams);
    return this.http.get<CollectionModel<T>>(`${this.resourceUrl}`, { params });
  }

  getById(id: number | string): Observable<T> {
    return this.http.get<T>(`${this.resourceUrl}/${id}`);
  }

  update(id: number | string, resource: Partial<T>): Observable<T> {
    return this.http.patch<T>(`${this.resourceUrl}/${id}`, resource);
  }

  upsert(resource: T): Observable<T> {
    return this.http.put<T>(`${this.resourceUrl}`, resource);
  }

  protected generateHttpUrl(resourceName: string, root: string | any) {
    return `${root}/${resourceName}`.toLowerCase();
  }

}
```
tramite [factory](https://en.wikipedia.org/wiki/Factory_method_pattern) costruiamo le differenti instanze dei rest service e le rendiamo disponibili nel root injector

```typescript
export interface Match { id: string; team_casa: string; team_trasferta: string; data: string; }
export interface Team { id: string; nome: string; coppaItalia: number }

const config = { root: `${environment.baseUrl}/api` };

export const MATCH_SERVICE = new InjectionToken<RestService<Match>>('Match RestService', {
  providedIn: 'root',
  factory: () => new RestServiceImpl('matches', inject(HttpClient), config),
});

export const TEAM_SERVICE = new InjectionToken<RestService<Team>>('Team RestService', {
  providedIn: 'root',
  factory: () => new RestServiceImpl('teams', inject(HttpClient), config),
});
```
profit :sunglasses:

```typescript
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    @Inject(MATCH_SERVICE) private readonly matchService: RestService<Match>,
    @Inject(TEAM_SERVICE) private readonly teamService: RestService<Team>,
  ) { }

  ngOnInit() {
    this.matchService.getAll({ data: '2020/06/17'}).subscribe();
    this.teamService.update('sscnapoli', { coppaItalia: 6 }).subscribe();
  }

}
```

Fermi tutti, se avessimo necessità di aggiungere metodi, modificare o arricchire il comportamento di quelli già presenti?
Nulla ci impedisce di estendere la classe **RestServiceImpl** oppure definire un [Helper](https://en.wikipedia.org/wiki/Delegation_pattern) o [Proxy](https://en.wikipedia.org/wiki/Proxy_pattern), preferendo così un approccio con la [Composition](https://en.wikipedia.org/wiki/Composition_over_inheritance) piuttosto che tramite l'[Inheritance](https://en.wikipedia.org/wiki/Inheritance_(object-oriented_programming)).

```typescript
@Injectable({ providedIn: 'root' })
export class TeamRestServiceImpl extends RestServiceImpl<Team> implements TeamRestService {

  constructor(protected readonly http: HttpClient) {
    super('teams', http, { root: environment.baseUrl + '/api' });
  }

  /** 
   * 403 Forbidden: se buyer !== 'Juventus'
  **/
  purchaseMatch(resource: TeamPurchase) {
    return this.http.post<TeamPurchase>(`${this.resourceUrl}/purchases`, resource); 
  }

}
```
