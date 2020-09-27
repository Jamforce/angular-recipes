import { Observable } from 'rxjs';
import { RestService, QueryParams, CollectionModel } from './rest.service';
import { tap, shareReplay } from 'rxjs/operators';


export class Cache implements Storage {
    private readonly store = new Map<string, { expiration: Date, value: any }>();

    constructor(private readonly itemTTL = 300) {}

    get length() {
        return this.store.size;
    }

    key(index: number): string {
        return this.store[index];
    }

    clear() {
        this.store.forEach((v, k) => this.store.delete(k));
    }

    getItem(key: string): any {
        let value = null;
        if (this.store.has(key)) {
            const item = this.store.get(key);
            if (item.expiration.getTime() < new Date().getTime()) {
                value = null;
                this.removeItem(key);
            } else {
                value = item.value;
            }
        }

        return value;
    }

    setItem(key: string, value: any) {
        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + this.itemTTL);
        this.store.set(key, { expiration, value });
    }

    removeItem(key: string) {
        this.store.delete(key);
    }

}

/**
 * @author Geremia Nappo <ge.nappo@almaviva.it>
 * @version 1.0.0
 * @summary Proxy per il caching delle risorse
 * in maniera elementare
 */
export class RestServiceCacheProxy<T> implements RestService<T> {

    get resourceName() {
        return this.delegate.resourceName;
    }
    private readonly cache: Cache = new Cache();

    constructor(
        private readonly delegate: RestService<T>
    ) { }

    create(resource: T): Observable<T> {
        return this.delegate.create(resource).pipe(
            tap(_ => this.cache.clear())
        );
    }

    delete(id: string | number): Observable<string | number> {
        return this.delegate.delete(id).pipe(
            tap(_ => this.cache.clear())
        );
    }

    getAll(params?: QueryParams | string): Observable<CollectionModel<T>> {
        let cached = this.cache.getItem(this.serialize(params));
        if (!cached) {
            cached = this.delegate.getAll(params).pipe(shareReplay(1));
            this.cache.setItem(this.serialize(params), cached);
        }
        return cached;
    }

    getById(id: string | number): Observable<T> {
        let cached = this.cache.getItem(this.serialize(id));
        if (!cached) {
            cached = this.delegate.getById(id).pipe(shareReplay(1));
            this.cache.setItem(this.serialize(id), cached);
        }
        return cached;
    }

    update(id: string | number, resource: Partial<T>): Observable<T> {
        return this.delegate.update(id, resource).pipe(
            tap(_ => this.cache.clear())
        );
    }

    upsert(resource: T): Observable<T> {
        return this.delegate.upsert(resource).pipe(
            tap(_ => this.cache.clear())
        );
    }

    private serialize(obj: any): string {
        return obj ? JSON.stringify(obj) : '';
    }

}
