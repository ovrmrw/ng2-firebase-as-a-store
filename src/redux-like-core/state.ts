import { Observable } from 'rxjs/Rx';
import bluebird from 'bluebird';
import lodash from 'lodash';

import { promisify } from './common';


export abstract class BaseState {

  // Stateクラスで使う。Storeから入ってくるPromiseかどうかわからないObservableをObservable<T>の形に整えて次に渡す。
  resolvedObservableByMergeMap<T>(observable: Observable<Promise<T> | T>, withInnerResolve: boolean = false): Observable<T> {
    return observable
      .map<Promise<T>>((state: Promise<T> | T) => withInnerResolve ? promisify(bluebird.props(state)) : promisify(state))
      .mergeMap<T>((stateAsPromise: Promise<T>) => Observable.fromPromise(stateAsPromise))
      // .map<T>(state => lodash.cloneDeep(state));
  }

  // Stateクラスで使う。Storeから入ってくるPromiseかどうかわからないObservableをObservable<T>の形に整えて次に渡す。
  resolvedObservableBySwitchMap<T>(observable: Observable<Promise<T> | T>, withInnerResolve: boolean = false): Observable<T> {
    return observable
      .map<Promise<T>>((state: Promise<T> | T) => withInnerResolve ? promisify(bluebird.props(state)) : promisify(state))
      .switchMap<T>((stateAsPromise: Promise<T>) => Observable.fromPromise(stateAsPromise))
      // .map<T>(state => lodash.cloneDeep(state));
  }

}