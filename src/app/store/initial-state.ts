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
  math: {
    addition: Promise.resolve<number>(0),
    subtraction: Promise.resolve<number>(100),
    multiplication: Promise.resolve<number>(2)
  },
  nest: {
    a: Promise.resolve({
      b: Promise.resolve({
        c: true
      })
    })
  },
};