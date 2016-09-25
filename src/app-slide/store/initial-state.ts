import { AppState, IncrementState } from './types';


export const defaultAppState: AppState = {
  increment: Promise.resolve({
    counter: 0
  } as IncrementState)
};