import { generateUuid } from '../../../angular-rxjs-redux';
import { AppState, ResolvedAppState, IncrementState, TimeState } from './types';


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



/* Component到達時にはこのようになる。 */
const resolvedAppState: ResolvedAppState = {
  increment: {
    counter: 0
  },
  restore: false,
  uuid: '1234-5678',
  time: {
    serial: 0
  },
  actionName: 'SomeAction',
  math: {
    addition: 0,
    subtraction: 100,
    multiplication: 2
  },
  nest: {
    a: {
      b: {
        c: true
      }
    }
  },
};