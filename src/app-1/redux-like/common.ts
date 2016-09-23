import { Injectable, OpaqueToken, Pipe, PipeTransform, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs/Rx';
import uuid from 'node-uuid';
import lodash from 'lodash';


// Storeの初期Stateをデフォルト値以外で作りたいときはこのTokenを使ってDIする。
export const InitialState = new OpaqueToken('InitialState');


// 主にServiceクラスからActionをnextし、Storeクラス内のReducersを発火させるために用いられる。
// 簡潔に言うと往路のSubject。
@Injectable()
export class Dispatcher<T> extends Subject<T> {
  constructor() { super(); }
}


// Storeクラス内のReducers処理後に新しい状態をnextし、ComponentクラスのViewを更新するために用いられる。
// 簡潔に言うと復路のSubject。
export class Provider<T> extends Subject<T> {
  constructor() { super(); }
}


// Storeクラス内でReducerを束ねて状態を管理し続けるObservable。
// ただのObservableだけど役割を区別できるよう名前を付けた。
export class ReducerContainer<T> extends Observable<T> {
  constructor() { super(); }
}


// Reducerを作るときに型として使う。引数にstateを取る場合。
export interface StateReducer<T> {
  (state: T, dispatcher: Dispatcher<any>, ...args: any[]): Observable<T>;
}


// Reducerを作るときに型として使う。引数にstateを取らない場合。
export interface NonStateReducer<T> {
  (dispatcher: Dispatcher<any>, ...args: any[]): Observable<T>;
}


// オブジェクトが含む全てのPromiseの解決を待った上でオブジェクトを返す。ネストが深くてもOK。ObservableはPromiseに変換される。
async function resolveAllAsyncStates<T>(obj: T | Promise<T> | Observable<T>): Promise<T> {
  let temp = obj;
  const rejectMessage = 'Resolving Promise or Observable is rejected in "resolveAllAsyncStates" function.';
  if (temp instanceof Promise || temp instanceof Observable) {
    try {
      temp = temp instanceof Observable ? await temp.take(1).toPromise() : await temp;
    } catch (err) {
      alert(rejectMessage);
      throw new Error(rejectMessage);
    }
    temp = await resolveAllAsyncStates(temp);
  } else if (temp instanceof Object) {
    for (let key in temp) {
      if (temp[key] instanceof Promise || temp[key] instanceof Observable) {
        try {
          temp[key] = temp instanceof Observable ? await temp[key].take(1).toPromise() : await temp[key];
        } catch (err) {
          alert(rejectMessage);
          throw new Error(rejectMessage);
        }
      }
      temp[key] = await resolveAllAsyncStates(temp[key]);
    }
  }
  return temp as T;
}


// 非同期(Promise,Observable)かどうかはっきりしないStateを強制的にPromiseにする。
export function promisify<T>(state: T | Promise<T> | Observable<T>, withInnerResolve: boolean = false): Promise<T> {
  const _state = withInnerResolve ? resolveAllAsyncStates(state) : state;
  if (_state instanceof Observable) {
    return _state.take(1).toPromise();
  } else if (_state instanceof Promise) {
    return _state;
  } else {
    return Promise.resolve<T>(_state);
  }
}


// 非同期(Promise,Observable)かどうかはっきりしないStateの型を同期的であると断定する。
export function isSync<T>(state: T | Promise<T> | Observable<T>): T {
  if (state instanceof Observable) {
    throw new Error('"state" should be synchronous is actually instanceof Observable!');
  } else if (state instanceof Promise) {
    throw new Error('"state" should be synchronous is actually instanceof Promise!');
  } else {
    return state;
  }
}


// StateをViewに表示するためのPipe。markForCheckをPipeの中で実行するとなぜかブラウザがフリーズするので"workaround"として使う。
@Pipe({
  name: 'asyncState',
  pure: false
})
export class AsyncStatePipe<T> implements PipeTransform, OnDestroy {
  private isSubscriptionCreated: boolean;
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
      // 1回目の実行時にここを通る。      
      this.subscription = observable
        .distinctUntilChanged((oldValue, newValue) => lodash.isEqual(oldValue, newValue))
        .subscribe(state => {
          this.latestValue = state;
          this.cd.markForCheck();
          if (debugMode) { console.log('AsyncStatePipe: markForCheck() is called.'); }
        }, err => {
          console.error(err);
        });
      if (debugMode) { console.log('AsyncStatePipe: Subscription is created.', observable); }
    }
    return this.latestValue;
  }
}


// Stateクラスで使う。Storeから入ってくるPromiseかどうかわからないObservableをObservable<T>の形に整えて次に渡す。
export function resolvedObservableByMergeMap<T>(observable: Observable<T | Promise<T> | Observable<T>>, withInnerResolve: boolean = false): Observable<T> {
  return observable
    .map<Promise<T>>(state => promisify(state, withInnerResolve))
    .mergeMap<T>(stateAsPromise => Observable.fromPromise(stateAsPromise));
}


// Stateクラスで使う。Storeから入ってくるPromiseかどうかわからないObservableをObservable<T>の形に整えて次に渡す。
export function resolvedObservableBySwitchMap<T>(observable: Observable<T | Promise<T> | Observable<T>>, withInnerResolve: boolean = false): Observable<T> {
  return observable
    .map<Promise<T>>(state => promisify(state, withInnerResolve))
    .switchMap<T>(stateAsPromise => Observable.fromPromise(stateAsPromise));
}


// 主にユーザー固有のIDを生成する目的で使う。
export function generateUuid(): string {
  return uuid.v4();
}