import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Store } from './store';
import { IncrementState } from './types';


/*
  Stateクラスから流れるストリームはComponentクラスでsubscribeしてViewを更新する。
*/
@Injectable()
export class State {
  constructor(
    private store: Store
  ) { }


  get incrementState$(): Observable<IncrementState> {
    return this.store.carrier$
      .map<Promise<IncrementState>>(state => state.increment)
      .mergeMap<IncrementState>(stateAsPromise => Observable.fromPromise(stateAsPromise));
      // .switchMap<IncrementState>(stateAsPromise => Observable.fromPromise(stateAsPromise)); // switchMapは次のストリームが流れてくると前のストリームをキャンセルする。
  }
}