import { Injectable, OpaqueToken, Pipe, PipeTransform, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs/Rx';
import uuid from 'node-uuid';
import lodash from 'lodash';


/**
 * 状態(state)の初期値をDIするときのTokenとして使う。
 */
export const InitialState = new OpaqueToken('InitialState');


/**
 * 主にServiceクラスからActionをnextし、Storeクラス内のReducersを発火させるために用いられる。
 * 簡潔に言うと往路のSubject。
 */
@Injectable()
export class Dispatcher<T> extends Subject<T> {
  constructor() { super(); }
  next(action: T) { super.next(action); } /* OverRide */
}


/**
 * Storeクラス内のReducers処理後に新しい状態をnextし、ComponentクラスのViewを更新するために用いられる。
 * 簡潔に言うと復路のSubject。
 */
export class Provider<T> extends Subject<T> {
  constructor() { super(); }
  next(newState: T) { super.next(newState); } /* OverRide */
}


/**
 * Storeクラス内でReducerを束ねて状態(state)を管理し続けるObservable。
 * ただのObservableだけど役割を区別できるよう名前を付けた。
 */
export class ReducerContainer<T> extends Observable<T> {
  constructor() { super(); }
}


/**
 * Reducerを作るときに型として使う。引数にstateを取る場合。
 */
export interface StateReducer<T> {
  (initState: T, dispatcher: Dispatcher<any>): Observable<T>;
}


/**
 * Reducerを作るときに型として使う。引数にstateを取らない場合。
 */
export interface NonStateReducer<T> {
  (dispatcher: Dispatcher<any>): Observable<T>;
}


/**
 * オブジェクトが含む全てのPromiseの解決を待った上でオブジェクトを返す。ネストが深くてもOK。
 * Observableは .take(1).toPromise() でPromiseに変換される。
 * (example)
 * {
 *   a: Promise.resolve({
 *     b: Promise.resolve({
 *       c: true
 *     })
 *   })
 * }
 * ↑このようなオブジェクトが ↓このように返される。
 * {
 *   a: {
 *     b: {
 *       c: true
 *     }
 *   }
 * }
 */
async function resolveInnerAsyncStates<T>(obj: T | Promise<T> | Observable<T>): Promise<T> {
  let temp = obj;
  const rejectMessage = 'Resolving a Promise or Observable is rejected in the "resolveInnerAsyncStates" function.';
  if (temp instanceof Promise || temp instanceof Observable) {
    try {
      temp = temp instanceof Observable ? await temp.take(1).toPromise() : await temp;
    } catch (err) {
      console.error(err);
      throw new Error(rejectMessage);
    }
    temp = await resolveInnerAsyncStates(temp);
  } else if (temp instanceof Object) {
    for (let key in temp) {
      if (temp[key] instanceof Promise || temp[key] instanceof Observable) {
        try {
          temp[key] = temp[key] instanceof Observable ? await temp[key].take(1).toPromise() : await temp[key];
        } catch (err) {
          console.error(err);
          throw new Error(rejectMessage);
        }
      }
      temp[key] = await resolveInnerAsyncStates(temp[key]);
    }
  }
  return temp as T;
}


/**
 * 非同期(Promise,Observable)かどうかはっきりしない状態(state)を強制的にPromiseにする。
 * 引数withInnerResolveがtrueのときはオブジェクト内の全ての非同期を解決した上で返す。
 * Observableは .take(1).toPromise() でPromiseに変換される。
 */
export function promisify<T>(state: T | Promise<T> | Observable<T>, withInnerResolve?: boolean): Promise<T> {
  const _state = withInnerResolve ? resolveInnerAsyncStates<T>(state) : state;
  if (_state instanceof Observable) {
    return _state.take(1).toPromise();
  } else if (_state instanceof Promise) {
    return _state;
  } else {
    return Promise.resolve<T>(_state);
  }
}


/**
 * 非同期(Promise,Observable)かどうかはっきりしない状態(state)の型を同期的であると断定する。
 * 主にComponentで状態(state)を受けるときに使う。
 */
export function resolved<T>(state: T | Promise<T> | Observable<T>): T {
  if (state instanceof Observable) {
    throw new Error('STATE should be synchronous(resolved) is actually instanceof Observable!');
  } else if (state instanceof Promise) {
    throw new Error('STATE should be synchronous(resolved) is actually instanceof Promise!');
  } else {
    return state;
  }
}


/**
 * StateをViewに表示するためのPipe。markForCheckをPipeの中で実行するとなぜかブラウザがフリーズするので"workaround"として使う。
 */
@Pipe({
  name: 'asyncState',
  pure: false
})
export class AsyncStatePipe<T> implements PipeTransform, OnDestroy {
  private subscription: Subscription;
  private latestValue: T | null = null;

  constructor(private cd: ChangeDetectorRef) { }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  transform(observable: Observable<T>, debugMode: boolean = false): T | null {
    if (debugMode) { console.log('AsyncStatePipe: transform() is called.'); }
    if (!this.subscription) {
      /* should pass here only for the first-time. */
      this.subscription = observable
        .subscribe(state => {
          this.latestValue = state;
          this.cd.markForCheck();
          if (debugMode) { console.log('AsyncStatePipe: markForCheck() is called.'); }
        }, err => {
          console.error('Error from AsyncStatePipe:', err);
        });
      if (debugMode) { console.log('AsyncStatePipe: Subscription is created.', observable); }
    }
    return this.latestValue;
  }
}


/**
 * StateCreatorで使う。Storeから入ってくるPromiseかどうかわからないObservableをObservable<T>の形に整えて次に流す。
 * Observable.fromPromise()後の状態(state)をmergeMapオペレーターで返す。
 */
export function takeEvery<T>(observableIncludesAsyncStates: Observable<T | Promise<T> | Observable<T>>, withInnerResolve?: boolean): Observable<T> {
  return observableIncludesAsyncStates
    .map<Promise<T>>(state => promisify<T>(state, withInnerResolve))
    .mergeMap<T>(stateAsPromise => Observable.fromPromise(stateAsPromise));
}


/**
 * StateCreatorで使う。Storeから入ってくるPromiseかどうかわからないObservableをObservable<T>の形に整えて次に流す。
 * Observable.fromPromise()後の状態(state)をswitchMapオペレーターで返す。
 */
export function takeLatest<T>(observableIncludesAsyncStates: Observable<T | Promise<T> | Observable<T>>, withInnerResolve?: boolean): Observable<T> {
  return observableIncludesAsyncStates
    .map<Promise<T>>(state => promisify<T>(state, withInnerResolve))
    .switchMap<T>(stateAsPromise => Observable.fromPromise(stateAsPromise));
}


/**
 * StateCreatorで使う。Componentに渡す直前に必ずこの関数を通すこと。
 * lodash.cloneDeep()してComponentからStoreの値を変更できないようにする。
 * distinctUntilChanged()で重複する値を流さないようにする。
 */
export function connect<T>(stateObservable: Observable<T>): Observable<T> {
  return stateObservable
    .do(state => {
      if (state instanceof Promise || state instanceof Observable) {
        throw new Error('Async states(Promise, Observable) are not allowed to pass througth the "connect" function.');
      }
    })
    .map<T>(state => lodash.cloneDeep(state)) /* make states immutable. */
    .distinctUntilChanged((oldValue, newValue) => lodash.isEqual(oldValue, newValue)) /* restrict duplicated states. */
    .do(state => { /* for debugging */
      // console.log('state after connect:', state);
    });
}


/**
 * 主にユーザー固有のIDを生成する目的で使う。
 */
export function generateUuid(): string {
  return uuid.v4();
}