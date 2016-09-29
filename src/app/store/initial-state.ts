import { generateUuid } from '../../../src-rxjs-redux';
import { AppState, IncrementState, TimeState } from './types';


export const defaultAppState: AppState = {
  increment: Promise.resolve<IncrementState>({
    counter: 0
  }),
  restore: false,
  uuid: generateUuid(),
  time: Promise.resolve<TimeState>({
    serial: 0
  }),
  actionName: '',
  nest: {
    a: Promise.resolve({
      b: Promise.resolve({
        c: true
      })
    })
  },
};