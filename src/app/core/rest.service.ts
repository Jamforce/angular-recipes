import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface QueryParams {
  [name: string]: string | string[];
}

export interface CollectionModel<T> {
  items: T[];
  count: number;
  sort: string;
}

export interface PagedModel<T> extends CollectionModel<T> {
  offset: number;
  limit: number;
  totalCount: number;
}

export interface RestService<T> {
  readonly resourceName: string;
  create(resource: T): Observable<T>;
  delete(id: number | string): Observable<number | string>;
  getAll(params?: QueryParams | string): Observable<CollectionModel<T>>;
  getById(id: number | string): Observable<T>;
  update(id: number | string, resource: Partial<T>): Observable<T>;
  upsert(resource: T): Observable<T>;
}

/**
 * @author Geremia Nappo <ge.nappo@almaviva.it>
 * @version 1.0.0
 * @summary Service per la persistence delle risorse
 * Assume una comune REST-y web API
 */
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

