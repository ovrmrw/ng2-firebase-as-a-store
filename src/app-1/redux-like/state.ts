import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Store } from './store';
import { IncrementState } from './types';
import { promisify, resolvedObservableBySwitchMap } from './common';


/*
  Stateクラスから流れるストリームはComponentクラスでsubscribeしてViewを更新する。
  Componentクラスを綺麗に保つため、全てのStateはObservable<T>の形に統一して返すこと。
*/
@Injectable()
export class State {
  constructor(
    private store: Store
  ) { }


  // Observable<Promise<IncrementState>> -> Observable<IncrementState>
  get incrementStateByMergeMap$(): Observable<IncrementState> {
    return this.store.provider$
      .map<Promise<IncrementState>>(appState => promisify(appState.increment))
      .mergeMap<IncrementState>(stateAsPromise => Observable.fromPromise(stateAsPromise));
  }

  // Observable<Promise<IncrementState>> -> Observable<IncrementState>
  get incrementStateBySwitchMap$(): Observable<IncrementState> {
    // return this.store.provider$
    //   .map<Promise<IncrementState>>(appState => promisify(appState.increment))
    //   .switchMap<IncrementState>(stateAsPromise => Observable.fromPromise(stateAsPromise));
    return resolvedObservableBySwitchMap(this.store.provider$.map(s => s.increment));
  }
  
}