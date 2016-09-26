import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import lodash from 'lodash';

import { promisify } from '../../../src-rxjs-redux';
import { Store } from './store';
import { AppState, IncrementState } from './types';


@Injectable()
export class State {
  private appState$: Observable<AppState>;

  constructor(
    private store: Store
  ) {
    this.appState$ = this.store.provider$;
  }


  // Observable<Promise<IncrementState>> -> Observable<IncrementState>
  get incrementStateByMergeMap$(): Observable<IncrementState> {
    return this.appState$
      .map<Promise<IncrementState>>(appState => promisify(appState.increment))
      .mergeMap<IncrementState>(stateAsPromise => Observable.fromPromise(stateAsPromise))
      .map<IncrementState>(state => lodash.cloneDeep(state));
  }


  // Observable<Promise<IncrementState>> -> Observable<IncrementState>
  get incrementStateBySwitchMap$(): Observable<IncrementState> {
    return this.appState$
      .map<Promise<IncrementState>>(appState => promisify(appState.increment))
      .switchMap<IncrementState>(stateAsPromise => Observable.fromPromise(stateAsPromise)) // cancellation
      .map<IncrementState>(state => lodash.cloneDeep(state));
  }

}