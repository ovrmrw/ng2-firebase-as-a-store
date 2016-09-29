import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { promisify, takeEvery, takeLatest, connect } from '../../../src-rxjs-redux';
import { Store } from './store';
import { AppState, ResolvedAppState, IncrementState, TimeState } from './types';


/*
  Componentクラスを綺麗に保つため、全てのStateは非同期を解決した上でObservable<T>の型に統一して返すこと。
*/
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


  /* Observable<Promise<TimeState>> --(mutation)--> Observable<TimeState> */
  get timeStateLatest$(): Observable<TimeState> {
    return connect(takeLatest<TimeState>(this.appState$.map(s => s.time)));
  }

}