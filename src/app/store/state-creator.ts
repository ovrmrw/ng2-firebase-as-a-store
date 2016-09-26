import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { promisify, takeEvery, takeLatest, connect } from '../../../src-rxjs-redux';
import { Store } from './store';
import { AppState, ResolvedAppState, IncrementState, TimeState } from './types';


/*
  Stateクラスから流れるストリームはComponentクラスでsubscribeしてViewを更新する。
  Componentクラスを綺麗に保つため、全てのStateはObservable<T>の形に統一して返すこと。
*/
@Injectable()
export class StateCreator {
  private appState$: Observable<AppState>;

  constructor(
    private store: Store
  ) {
    this.appState$ = this.store.provider$;
  }


  getState(): Observable<ResolvedAppState> {
    return connect(takeLatest(this.appState$, true)) as Observable<ResolvedAppState>;
  }


  get incrementStateEvery$(): Observable<IncrementState> {
    return connect(takeEvery(this.appState$.map(s => s.increment)));
  }


  get incrementStateLatest$(): Observable<IncrementState> {
    return connect(takeLatest(this.appState$.map(s => s.increment)));
  }


  get timeState$(): Observable<TimeState> {
    return connect(takeLatest(this.appState$.map(s => s.time)));
  }

}