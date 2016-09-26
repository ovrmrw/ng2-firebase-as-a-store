import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { promisify, stateByMergeMap, stateBySwitchMap, connect } from '../../../src-rxjs-redux';
import { Store } from './store';
import { AppState, ResolvedAppState, IncrementState, TimeState } from './types';


/*
  Stateクラスから流れるストリームはComponentクラスでsubscribeしてViewを更新する。
  Componentクラスを綺麗に保つため、全てのStateはObservable<T>の形に統一して返すこと。
*/
@Injectable()
export class State {
  private appState$: Observable<AppState>;

  constructor(
    private store: Store
  ) {
    this.appState$ = this.store.provider$;
  }


  getState(): Observable<ResolvedAppState> {
    return connect(stateBySwitchMap(this.appState$, true)) as Observable<ResolvedAppState>;
  }


  get incrementStateByMergeMap$(): Observable<IncrementState> {
    return connect(stateByMergeMap(this.appState$.map(s => s.increment)));
  }


  get incrementStateBySwitchMap$(): Observable<IncrementState> {
    return connect(stateBySwitchMap(this.appState$.map(s => s.increment)));
  }


  get timeState$(): Observable<TimeState> {
    return connect(stateBySwitchMap(this.appState$.map(s => s.time)));
  }

}