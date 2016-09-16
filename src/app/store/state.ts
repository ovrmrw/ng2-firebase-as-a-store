import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Store } from './store';
import { IncrementState, AppState } from './types';


/*
  Stateクラスから流れるストリームはComponentクラスでsubscribeしてViewを更新する。
*/
@Injectable()
export class State {
  constructor(
    private store: Store
  ) { }


  get incrementState$(): Observable<IncrementState> {
    return this.store.provider$
      .map<Promise<IncrementState>>((appState: AppState) => appState.increment) // 本来は型指定不要
      .mergeMap<IncrementState>((stateAsPromise: Promise<IncrementState>) => Observable.fromPromise(stateAsPromise)); // 本来は型指定不要
      // .switchMap<IncrementState>(stateAsPromise => Observable.fromPromise(stateAsPromise)); // switchMapは次のストリームが流れてくると前のストリームをキャンセルする。
  }
}