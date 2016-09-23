import uuid from 'node-uuid';

import { AppState } from './types';


/*
  StateはPromiseを持つことができる。ただし第一階層だけにすること。
  (bluebird.props()の仕様で第二階層以降のPromiseは解決されないままComponentに届くことになる)
*/
export const defaultAppState: AppState = {
  increment: Promise.resolve({
    counter: 0
  }),
  restore: false,
  uuid: uuid.v4(),

  // ComponentにStateが届いたとき、第一階層のincrementは解決済みの状態となるが、nestedPromiseはPromiseのままとなる。
  // これはbluebird.props()の仕様で第一階層のPromiseのみ解決されるため。
  test: {
    nestedPromise: Promise.resolve({
      result: 'Not resolved when Components get this state.'
    })
  }
};