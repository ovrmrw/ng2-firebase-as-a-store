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
  nest: {
    a: {
      b: Promise.resolve({
        c: true
      })
    }
  }
};