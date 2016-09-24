import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { promisify, toObservableBySwitchMap } from '../redux-like';
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


  // Observable<Promise<IncrementState>> -> Observable<IncrementState>
  get incrementStateByMergeMap$(): Observable<IncrementState> {
    return this.appState$
      // .map<Promise<IncrementState>>(appState => promisify(appState.increment))
      // .mergeMap<IncrementState>(stateAsPromise => Observable.fromPromise(stateAsPromise));
      .mergeMap<IncrementState>(state => Observable.fromPromise(promisify(state.increment)));
  }

  // Observable<Promise<IncrementState>> -> Observable<IncrementState>
  get incrementStateBySwitchMap$(): Observable<IncrementState> {
    return this.appState$
      //   .map<Promise<IncrementState>>(appState => promisify(appState.increment))
      //   .switchMap<IncrementState>(stateAsPromise => Observable.fromPromise(stateAsPromise));
      .switchMap<IncrementState>(state => Observable.fromPromise(promisify(state.increment))); // cancellation
  }


  get appStateBySwitchMap$(): Observable<AppState> {
    return toObservableBySwitchMap(this.appState$, true);
  }

}