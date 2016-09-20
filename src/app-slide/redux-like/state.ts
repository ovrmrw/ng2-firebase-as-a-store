import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Store } from './store';
import { IncrementState, AppState } from './types';
import { resolvedObservableByMergeMap, resolvedObservableBySwitchMap } from './common';


/*
  Stateクラスから流れるストリームはComponentクラスでsubscribeしてViewを更新する。
  Componentクラスを綺麗に保つため、全てのStateはObservable<T>の形に統一して返すこと。
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
  get incrementStateByMergeMap$(): Observable<IncrementState> {
    return resolvedObservableByMergeMap(this.store.provider$.map(s => s.increment));
  }

  // Observable<Promise<IncrementState>> -> Observable<IncrementState>
  get incrementStateBySwitchMap$(): Observable<IncrementState> {
    return resolvedObservableBySwitchMap(this.store.provider$.map(s => s.increment));
  }

  get restoreState$(): Observable<boolean> {
    return this.store.provider$.map(s => s.restore);
  }
}