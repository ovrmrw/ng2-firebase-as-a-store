import { generateUuid } from '../redux-like';
import { AppState, IncrementState, TimeState } from './types';


/*
  StateはPromiseを持つことができる。
*/
export const defaultAppState: AppState = {
  increment: Promise.resolve({
    counter: 0
  } as IncrementState),
  restore: false,
  uuid: generateUuid(),
  nest: {
    a: Promise.resolve({
      b: Promise.resolve({
        c: true
      })
    })
  },
  time: Promise.resolve({
    serial: 0
  } as TimeState)
};