import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { promisify, toStateObservableByMergeMap, toStateObservableBySwitchMap } from '../redux-like';
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
    return toStateObservableBySwitchMap(this.appState$, true) as Observable<ResolvedAppState>;
  }


  get incrementStateByMergeMap$(): Observable<IncrementState> {
    return toStateObservableByMergeMap(this.appState$.map(s => s.increment));
  }


  get incrementStateBySwitchMap$(): Observable<IncrementState> {
    return toStateObservableBySwitchMap(this.appState$.map(s => s.increment));
  }


  get timeState$(): Observable<TimeState> {
    return toStateObservableBySwitchMap(this.appState$.map(s => s.time));
  }

}