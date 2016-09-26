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


  // Observable<AppState> -> Observable<ResolvedAppState>
  getState(): Observable<ResolvedAppState> {
    return connect(takeLatest(this.appState$, true)) as Observable<ResolvedAppState>;
  }


  // Observable<Promise<IncrementState>> -> Observable<IncrementState>
  get incrementStateEvery$(): Observable<IncrementState> {
    return connect(takeEvery(this.appState$.map(s => s.increment)));
  }


  // Observable<Promise<IncrementState>> -> Observable<IncrementState>
  get incrementStateLatest$(): Observable<IncrementState> {
    return connect(takeLatest(this.appState$.map(s => s.increment)));
  }

}