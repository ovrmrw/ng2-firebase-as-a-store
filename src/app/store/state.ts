import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { promisify, toObservableByMergeMap, toObservableBySwitchMap } from '../redux-like';
import { Store } from './store';
import { AppState, IncrementState } from './types';


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


  get incrementStateByMergeMap$(): Observable<IncrementState> {
    return toObservableByMergeMap(this.appState$.map(s => s.increment));
  }


  get incrementStateBySwitchMap$(): Observable<IncrementState> {
    return toObservableBySwitchMap(this.appState$.map(s => s.increment));
  }


  get appStateBySwitchMap$(): Observable<AppState> {
    return toObservableBySwitchMap(this.appState$, true);
  }

}