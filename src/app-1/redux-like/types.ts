export interface IncrementState {
  counter: number;
}

export interface AppState {
  increment: Promise<IncrementState> | IncrementState;
  restore: boolean;
  uuid: string;
}