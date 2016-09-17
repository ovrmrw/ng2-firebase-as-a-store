export interface IncrementState {
  counter: number;
}

export interface TimeState {
  serial: number;
}

export interface AppState {
  increment: Promise<IncrementState> | IncrementState;
  restore: boolean;
  uuid: string;
  canSaveToFirebase: () => boolean;
  time: Promise<TimeState> | TimeState;
}