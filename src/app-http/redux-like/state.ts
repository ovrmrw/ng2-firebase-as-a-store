import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import bluebird from 'bluebird';

import { Store } from './store';
import { IncrementState, TimeState, AppState } from './types';
import { promisify } from './common';


/*
  Stateクラスから流れるストリームはComponentクラスでsubscribeしてViewを更新する。
  Componentクラスを綺麗に保つために余計なmap処理はここで済ませる。
*/
@Injectable()
export class State {
  constructor(
    private store: Store
  ) { }


  get appState$(): Observable<AppState> {
    return this.store.provider$
      .map<Promise<AppState>>((appState: AppState) => promisify(bluebird.props(appState))) // bluebird.props()で一旦オブジェクト内のPromiseを全て解決してから再度Promise化しているのがポイント。
      .mergeMap<AppState>((stateAsPromise: Promise<AppState>) => Observable.fromPromise(stateAsPromise)); // 本来はコールバック引数の型指定不要
  }

  get incrementState$(): Observable<IncrementState> {
    return this.store.provider$
      .map<Promise<IncrementState>>((appState: AppState) => promisify(appState.increment)) // 本来はコールバック引数の型指定不要
      .mergeMap<IncrementState>((stateAsPromise: Promise<IncrementState>) => Observable.fromPromise(stateAsPromise)); // 本来はコールバック引数の型指定不要
    // .switchMap<IncrementState>(stateAsPromise => Observable.fromPromise(stateAsPromise)); // switchMapは次のストリームが流れてくると前のストリームをキャンセルする。
  }

  get timeState$(): Observable<TimeState> {
    return this.store.provider$
      .map<Promise<TimeState>>((appState: AppState) => promisify(appState.time)) // 本来はコールバック引数の型指定不要
      .switchMap<TimeState>((stateAsPromise: Promise<TimeState>) => Observable.fromPromise(stateAsPromise)); // switchMapは次のストリームが流れてくると前のストリームをキャンセルする。
  }
}