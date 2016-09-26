export interface IncrementState {
  counter: number;
}


export interface AppState {
  increment: IncrementState | Promise<IncrementState>;
}


export interface ResolvedAppState {
  increment: IncrementState;
}