export interface IncrementState {
  counter: number;
}

export interface TimeState {
  serial: number;
}

export interface AppState {
  increment: Promise<IncrementState> | IncrementState;
  restore: boolean;
  // canSaveToFirebase: () => boolean;
  time: Promise<TimeState> | TimeState;
  uuid: string;
  test?: {
    nestedPromise: Promise<{}> | {};
  };
}