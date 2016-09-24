export interface IncrementState {
  counter: number;
}

export interface AppState {
  increment: IncrementState | Promise<IncrementState>;
  restore: boolean;
  uuid: string;
  nest?: {};
}