import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import lodash from 'lodash';

import { promisify, takeLatest, takeEvery, connect } from '../../../src-rxjs-redux';
import { Store } from './store';
import { AppState, ResolvedAppState, IncrementState } from './types';


@Injectable()
export class State {
  private appState$: Observable<AppState>;

  constructor(
    private store: Store
  ) {
    this.appState$ = this.store.provider$;
  }


  /* Observable<AppState> --(mutation)--> Observable<ResolvedAppState> */
  /* AppStateからResolvedAppStateへの変換はtype-errorにならない。 */
  getState(): Observable<ResolvedAppState> {
    return connect(takeLatest<AppState>(this.appState$, true)) as Observable<ResolvedAppState>;
  }


  /* Observable<Promise<IncrementState>> --(mutation)--> Observable<IncrementState> */
  get incrementStateEvery$(): Observable<IncrementState> {
    return connect(takeEvery<IncrementState>(this.appState$.map(s => s.increment)));
  }


  /* Observable<Promise<IncrementState>> --(mutation)--> Observable<IncrementState> */
  get incrementStateLatest$(): Observable<IncrementState> {
    return connect(takeLatest<IncrementState>(this.appState$.map(s => s.increment)));
  }

}