import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import lodash from 'lodash';

import { promisify, takeLatest, connect } from '../../../src-rxjs-redux';
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


  getState(): Observable<AppState> {
    return connect(takeLatest(this.appState$, true));
  }


  // Observable<Promise<IncrementState>> -> Observable<IncrementState>
  get incrementStateEvery$(): Observable<IncrementState> {
    return this.appState$
      .map<Promise<IncrementState>>(appState => promisify(appState.increment))
      .mergeMap<IncrementState>(stateAsPromise => Observable.fromPromise(stateAsPromise))
      .map<IncrementState>(state => lodash.cloneDeep(state));
  }


  // Observable<Promise<IncrementState>> -> Observable<IncrementState>
  get incrementStateLatest$(): Observable<IncrementState> {
    return this.appState$
      .map<Promise<IncrementState>>(appState => promisify(appState.increment))
      .switchMap<IncrementState>(stateAsPromise => Observable.fromPromise(stateAsPromise)) // cancellation
      .map<IncrementState>(state => lodash.cloneDeep(state));
  }

}