import { Observable } from 'rxjs/Rx';

import { promisify } from './common';


export abstract class BaseState {

  // Stateクラスで使う。Storeから入ってくるPromiseかどうかわからないObservableをObservable<T>の形に整えて次に渡す。
  resolvedObservableByMergeMap<T>(observable: Observable<Promise<T> | T>, withInnerResolve: boolean = false): Observable<T> {
    return observable
      .map<Promise<T>>((state: Promise<T> | T) => withInnerResolve ? promisify(state, true) : promisify(state))
      .mergeMap<T>((stateAsPromise: Promise<T>) => Observable.fromPromise(stateAsPromise));
  }

  // Stateクラスで使う。Storeから入ってくるPromiseかどうかわからないObservableをObservable<T>の形に整えて次に渡す。
  resolvedObservableBySwitchMap<T>(observable: Observable<Promise<T> | T>, withInnerResolve: boolean = false): Observable<T> {
    return observable
      .map<Promise<T>>((state: Promise<T> | T) => withInnerResolve ? promisify(state, true) : promisify(state))
      .switchMap<T>((stateAsPromise: Promise<T>) => Observable.fromPromise(stateAsPromise));
  }

}