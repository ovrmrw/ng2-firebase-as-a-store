import uuid from 'node-uuid';

import { AppState } from './types';


export const defaultAppState: AppState = {
  increment: Promise.resolve({
    counter: 0
  }),
  restore: false,
  uuid: uuid.v4(),
  time: Promise.resolve({
    serial: 0
  }),

  test: {
    nestedPromise: Promise.resolve({
      result: 'Not resolved when Components get this state.'
    })
  }
};