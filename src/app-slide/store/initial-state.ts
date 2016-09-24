import { generateUuid } from '../redux-like';
import { AppState } from './types';


export const defaultAppState: AppState = {
  increment: Promise.resolve({
    counter: 0
  }),
  uuid: generateUuid(),
};