import { OpaqueToken, Pipe, PipeTransform, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs/Rx';
import bluebird from 'bluebird';


// Storeの初期Stateをデフォルト値以外で作りたいときはこのTokenを使ってDIする。
export const InitialState = new OpaqueToken('InitialState');


// 主にServiceクラスからActionをnextし、Storeクラス内のReducersを発火させるために用いられる。
// 簡潔に言うと往路のSubject。
export class Dispatcher<T> extends Subject<T> {
  constructor() { super(); }
}


// Storeクラス内のReducers処理後に新しい状態をnextし、ComponentクラスのViewを更新するために用いられる。
// 簡潔に言うと復路のSubject。
export class Provider<T> extends Subject<T> {
  constructor() { super(); }
}


// StoreクラスはBaseStoreクラスを継承して作る。
export abstract class BaseStore {
  abstract readonly provider$: Provider<{}>;
  abstract applyReducers(state: {}): void;
  abstract applyMiddlewares(state: {}): void;
  abstract effectAfterReduced(state: {}): void;
}


// PromiseかどうかはっきりしないStateを強制的にPromiseにする。
export function promisify<T>(state: T | Promise<T>): Promise<T> {
  return state instanceof Promise ? state : Promise.resolve(state);
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
  private subs: Subscription[] = [];
  set disposable(sub: Subscription) { this.subs.push(sub); }
  private latestValue: T | null = null;

  constructor(private cd: ChangeDetectorRef) { }

  ngOnDestroy() {
    if (this.subs.length) {
      this.subs.forEach(sub => sub.unsubscribe());
    }
  }

  transform(observable: Observable<T>, debugMode: boolean = false): T | null {
    if (debugMode) { console.log('AsyncStatePipe: transform() is called.'); }
    if (!this.isSubscriptionCreated) {
      // 1回目の実行時にここを通る。      
      this.disposable = observable
        .subscribe(state => {
          this.latestValue = state;
          this.cd.markForCheck();
          if (debugMode) { console.log('AsyncStatePipe: markForCheck() is called.'); }
        }, err => {
          console.error(err);
        });
      this.isSubscriptionCreated = true;
      if (debugMode) { console.log('AsyncStatePipe: Subscription is created.', observable); }
    }
    return this.latestValue;
  }
}


// Stateクラスで使う。Storeから入ってくるPromiseかどうかわからないObservableをObservable<T>の形に整えて次に渡す。
export function resolvedObservableByMergeMap<T>(observable: Observable<Promise<T> | T>, withResolve: boolean = false): Observable<T> {
  return observable
    .map<Promise<T>>((state: Promise<T> | T) => withResolve ? promisify(bluebird.props(state)) : promisify(state))
    .mergeMap<T>((stateAsPromise: Promise<T>) => Observable.fromPromise(stateAsPromise));
}


// Stateクラスで使う。Storeから入ってくるPromiseかどうかわからないObservableをObservable<T>の形に整えて次に渡す。
export function resolvedObservableBySwitchMap<T>(observable: Observable<Promise<T> | T>, withResolve: boolean = false): Observable<T> {
  return observable
    .map<Promise<T>>((state: Promise<T> | T) => withResolve ? promisify(bluebird.props(state)) : promisify(state))
    .switchMap<T>((stateAsPromise: Promise<T>) => Observable.fromPromise(stateAsPromise));
}