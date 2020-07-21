import { Observable, BehaviorSubject } from 'rxjs';

/**
 * @author Geremia Nappo <ge.nappo@almaviva.it>
 * @version 1.0.0
 * @summary Service di base per lo state management
 */
export abstract class Store<T> {

  state$: Observable<T>;
  private readonly stateSubject$: BehaviorSubject<T>;
  private initialState: T;

  protected constructor(initialState: T) {
    this.stateSubject$ = new BehaviorSubject(initialState);
    this.state$ = this.stateSubject$.asObservable();
    this.initialState = initialState;
  }

  getStateSnapshot(): T {
    return this.stateSubject$.getValue();
  }

  setState(nextState: T): void {
    this.stateSubject$.next(nextState);
  }

  reset() {
    this.setState(this.initialState);
  }

}
