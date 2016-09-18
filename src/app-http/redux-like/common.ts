import { OpaqueToken, Pipe, PipeTransform, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';


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


// StateをViewに表示するためのPipe。markForCheckをPipeの中で実行するとなぜかブラウザがフリーズするのでwork aroundとして使う。
@Pipe({
  name: 'asyncState',
  pure: false
})
export class AsyncStatePipe<T> implements PipeTransform, OnDestroy {
  private subs: Subscription[] = [];
  set disposable(sub: Subscription) { this.subs.push(sub); }
  private latestValue: T | null = null;

  ngOnDestroy() {
    if (this.subs.length) {
      this.subs.forEach(sub => sub.unsubscribe());
    }
  }

  transform(observable: Observable<T> | null): T | null {
    if (observable) {
      // 1回目の実行時にここを通る。
      this.disposable = observable
        .subscribe(state => {
          this.latestValue = state;
          // this.transform(null); // transformをもう一回実行する。
        }, err => {
          console.error(err);
        });
    }
    return this.latestValue;
  }
}