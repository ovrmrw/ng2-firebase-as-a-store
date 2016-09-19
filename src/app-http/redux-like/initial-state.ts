import { Injectable } from '@angular/core';
import uuid from 'node-uuid';

import { AppState } from './types';


@Injectable()
export class DefaultAppState implements AppState {
  increment = Promise.resolve({
    counter: 0
  });
  restore = false;
  uuid = uuid.v4();
  canSaveToFirebase = () => !this.restore; // Stateに関数を含めることもできる。
  time = Promise.resolve({
    serial: 0
  });
}