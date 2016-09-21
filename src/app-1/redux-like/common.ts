import { Injectable, OpaqueToken, Pipe, PipeTransform, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs/Rx';
import uuid from 'node-uuid';


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


// Reducerを作るときに型として使う。
export interface Reducer<T> {
  (state: T | Promise<T> | null, dispatcher: Dispatcher<any>, ...args: any[]): Observable<T | Promise<T>>;
}


// // StoreクラスはBaseStoreクラスを継承して作る。
// export abstract class BaseStore {
//   abstract readonly provider$: Provider<{}>;
//   abstract applyReducers(state: {}): void;
//   abstract applyMiddlewares(state: {}): void;
//   abstract effectAfterReduced(state: {}): void;
// }


// オブジェクトが含む全てのPromiseを解決した上でオブジェクトを返す。
async function resolveAllPromise<T>(obj: T | Promise<T> | null): Promise<T | null> {
  let temp = obj;
  if (temp instanceof Promise) {
    try {
      temp = await temp;
    } catch (err) {
      console.error(err);
      temp = null;
      alert('Promise is rejected.');
    }
    temp = await resolveAllPromise(temp);
  } else if (temp instanceof Object) {
    for (let key in temp) {
      if (temp[key] instanceof Promise) {
        try {
          temp[key] = await temp[key];
        } catch (err) {
          console.error(err);
          temp[key] = null;
          alert('Promise is rejected.');
        }
      }
      temp[key] = await resolveAllPromise(temp[key]);
    }
  }
  return temp;
}


// PromiseかどうかはっきりしないStateを強制的にPromiseにする。
export function promisify<T>(state: T | Promise<T> | null, withInnerResolve: boolean = false): Promise<T | null> {
  const _state = withInnerResolve ? resolveAllPromise(state) : state;
  return _state instanceof Promise ? _state : Promise.resolve<T | null>(_state);
}


// PromiseかどうかはっきりしないStateの型をPromiseではないと断定する。
export function notPromise<T>(state: T | Promise<T>): T {
  if (state instanceof Promise) {
    throw '"state" should be not Promise is instanceof Promise!';
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
        .distinctUntilChanged()
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
export function resolvedObservableByMergeMap<T>(observable: Observable<T | Promise<T> | null>, withInnerResolve: boolean = false): Observable<T> {
  return observable
    .map<Promise<T>>(state => promisify(state, withInnerResolve))
    .mergeMap<T>(stateAsPromise => Observable.fromPromise(stateAsPromise));
}


// Stateクラスで使う。Storeから入ってくるPromiseかどうかわからないObservableをObservable<T>の形に整えて次に渡す。
export function resolvedObservableBySwitchMap<T>(observable: Observable<T | Promise<T> | null>, withInnerResolve: boolean = false): Observable<T> {
  return observable
    .map<Promise<T>>(state => promisify(state, withInnerResolve))
    .switchMap<T>(stateAsPromise => Observable.fromPromise(stateAsPromise));
}


// 主にユーザー固有のIDを生成する目的で使う。
export function generateUuid(): string {
  return uuid.v4();
}