import { BehaviorSubject } from 'rxjs/Rx';
import uuid from 'node-uuid';

import { Provider, ReducerContainer } from './common';
import { BaseReducer } from './reducer';

// StoreクラスはBaseStoreクラスを継承して作る。
export abstract class BaseStore<T> {

  private _provider$: Provider<T>;
  get provider$() { return this._provider$; }

  private _reducer: BaseReducer<T>;


  constructor(initialState: T, reducer: BaseReducer<T>) {
    this._reducer = reducer;
    this._provider$ = new BehaviorSubject(initialState);
    this.applyReducers(initialState);
  }


  applyReducers<T>(initialState: T): void {
    ReducerContainer
      .zip<T>(...[ // わざわざ配列にした上でSpreadしているのは、VSCodeのオートインデントが有効になるから。
        ...this._reducer.reducers,
        this._reducer.stateStructure
      ])
      .subscribe((newState: T) => { // 本来は型指定不要
        console.log('newState:', newState);
        this.provider$.next(newState); // ProviderをnextしてStateクラスにストリームを流す。
        this.effectAfterReduced(newState);
      });
  }

  abstract applyMiddlewares<T>(initialState: T): void;
  abstract effectAfterReduced<T>(newState: T): void;

}