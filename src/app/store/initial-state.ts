import { generateUuid } from '../redux-like';
import { AppState } from './types';


/*
  StateはPromiseを持つことができる。
*/
export const defaultAppState: AppState = {
  increment: Promise.resolve({
    counter: 0
  }),
  restore: false,
  uuid: generateUuid(),
  nest: {
    a: Promise.resolve({
      b: Promise.resolve({
        c: true
      })
    })
  }
};