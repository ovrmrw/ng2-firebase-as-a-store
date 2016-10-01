import { AppState, IncrementState, ResolvedAppState } from './types';


export const defaultAppState: AppState = {
  increment: Promise.resolve<IncrementState>({
    counter: 0
  })
};



/* Component到達時にはこのようになる。 */
const resolvedAppState: ResolvedAppState = {
  increment: {
    counter: 0
  }
};