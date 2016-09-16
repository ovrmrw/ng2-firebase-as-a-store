export interface IncrementState {
  counter: number;
}

export interface AppState {
  increment: Promise<IncrementState>;
  restore: boolean;
  uuid: string;
  isWriteToFirebase: () => boolean;
}

export interface ResolvedAppState {
  increment: IncrementState;
  restore: boolean;
  uuid: string;
}