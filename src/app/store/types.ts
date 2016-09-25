export interface IncrementState {
  counter: number;
}

export interface TimeState {
  serial: number;
}


export interface AppState {
  increment: IncrementState | Promise<IncrementState>;
  restore: boolean;
  uuid: string;
  time: TimeState | Promise<TimeState>;
  nest?: {};
}

export interface ResolvedAppState {
  increment: IncrementState;
  restore: boolean;
  uuid: string;
  time: TimeState;
  nest?: {};
}
