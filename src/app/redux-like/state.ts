import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Store } from './store';
import { IncrementState, AppState } from './types';
import { getObservableByMergeMap, getObservableBySwitchMap } from './common';


/*
  Stateクラスから流れるストリームはComponentクラスでsubscribeしてViewを更新する。
  Componentクラスを綺麗に保つため、全てのStateはObservable<T>の形に統一して返すこと。
*/
@Injectable()
export class State {
  constructor(
    private store: Store
  ) { }


  get appState$(): Observable<AppState> {
    return getObservableByMergeMap(this.store.provider$.asObservable(), true);
  }

  get incrementState$(): Observable<IncrementState> {
    return getObservableByMergeMap(this.store.provider$.map(s => s.increment));
  }

  get restoreState$(): Observable<boolean> {
    // return getObservableByMergeMap(this.store.provider$.map(s => s.restore));
    return this.store.provider$.map(s => s.restore);
  }
}