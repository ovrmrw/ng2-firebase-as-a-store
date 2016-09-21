export interface IncrementState {
  counter: number;
}

export interface AppState {
  increment: Promise<IncrementState> | IncrementState | null;
  restore: boolean;
  uuid: string;
  nest?: {};
}