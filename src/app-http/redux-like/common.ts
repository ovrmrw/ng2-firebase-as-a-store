import { OpaqueToken } from '@angular/core';
import { Subject } from 'rxjs/Subject';


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