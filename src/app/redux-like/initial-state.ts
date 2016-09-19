import { AppState } from './types';
import uuid from 'node-uuid';


export class DefaultAppState implements AppState {
  increment = Promise.resolve({
    counter: 0
  });
  restore = false;
  uuid = uuid.v4();
  canSaveToFirebase = () => !this.restore; // Stateに関数を含めることもできる。
}