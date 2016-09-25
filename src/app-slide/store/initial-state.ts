import { AppState, IncrementState } from './types';


export const defaultAppState: AppState = {
  increment: Promise.resolve<IncrementState>({
    counter: 0
  })
};