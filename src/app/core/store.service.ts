import { Observable, BehaviorSubject } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { equals, map as Rmap, path } from 'ramda';
import { environment } from '../../environments/environment';

/**
 * @author Geremia Nappo <ge.nappo@almaviva.it>
 * @version 1.0.0
 * @summary Service di base per lo state management
 */
export class Store<T extends object> {

  state$: Observable<T>;
  private readonly stateSubject$: BehaviorSubject<T>;
  private readonly initialState: T;

  constructor(initialState: T = {} as T) {
    this.stateSubject$ = new BehaviorSubject(initialState);
    this.state$ = this.stateSubject$.asObservable();
    this.initialState = initialState;
  }

  getStateSnapshot(): T {
    return this.stateSubject$.getValue();
  }

  setState(nextState: T): void {
    const value = environment.production ? nextState : this.deepFreeze(nextState);
    this.stateSubject$.next(value);
  }

  patchState(value: Partial<T> | any): void {
    const currentState = this.getStateSnapshot() as any;
    this.setState({ ...currentState, ...value });
  }

  reset() {
    this.setState(this.initialState);
  }

  select(pathOrMapFn: string | string[] | ((state: T) => any)) {
    return this.stateSubject$.pipe(
      typeof pathOrMapFn !== 'function' ?
      map(state => path([].concat(pathOrMapFn), state)) : map(state => pathOrMapFn(state)),
      distinctUntilChanged(equals)
    );
  }

  selectSnapshot(pathOrMapFn: string | string[] | ((state: T) => any)) {
    const state = this.stateSubject$.getValue();
    return typeof pathOrMapFn !== 'function' ?
      path([].concat(pathOrMapFn), state) : Rmap(pathOrMapFn, state);
  }


  private deepFreeze(object) {
    const propNames = Object.getOwnPropertyNames(object);
    for (const name of propNames) {
      const value = object[name];
      if (value && typeof value === 'object') {
        this.deepFreeze(value);
      }
    }
    return Object.freeze(object);
  }

}
