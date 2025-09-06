// Augment DOM event map so Angular template type checking knows about our custom event
declare global {
  interface HTMLElementEventMap {
    'counterchange': CustomEvent<number>;
  }
}

export {};


