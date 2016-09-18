import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { Store } from './store';
import { IncrementState, TimeState, AppState } from './types';
import { resolvedObservableByMergeMap, resolvedObservableBySwitchMap } from './common';


/*
  Stateクラスから流れるストリームはComponentクラスでsubscribeしてViewを更新する。
  Componentクラスを綺麗に保つため、全てのStateは内包するPromiseを全て解決した上でObservable<T>の形に統一して返すこと。
*/
@Injectable()
export class State {
  constructor(
    private store: Store
  ) { }


  // Observable<AppState>(オブジェクト内にPromiseを含む) -> Observable<AppState>(オブジェクト内のPromiseは全て解決済み)
  get appState$(): Observable<AppState> {
    return resolvedObservableByMergeMap(this.store.provider$.asObservable(), true);
  }

  // Observable<Promise<IncrementState>> -> Observable<IncrementState>
  get incrementState$(): Observable<IncrementState> {
    return resolvedObservableByMergeMap(this.store.provider$.map(s => s.increment));
  }

  // Observable<Promise<TimeState>> -> Observable<TimeState>
  get timeState$(): Observable<TimeState> {
    return resolvedObservableBySwitchMap(this.store.provider$.map(s => s.time));
  }

  get restoreState$(): Observable<boolean> {
    return this.store.provider$.map(s => s.restore);
  }
}