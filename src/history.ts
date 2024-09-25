class HistoryManager<T> {
  private historyStack: string[] = [];
  private redoStack: string[] = [];
  private maxStackSize: number;

  constructor(maxStackSize: number) {
    this.maxStackSize = maxStackSize;
  }

  saveState(state: T[]): void {
    const serializedState = JSON.stringify(state);
    // if (this.historyStack && (this.historyStack.pop() === serializedState)) {

    // }
    this.historyStack.push(JSON.stringify(state));

    // Limit the stack size
    if (this.historyStack.length > this.maxStackSize) {
      this.historyStack.shift(); // Remove the oldest entry
    }

    // Clear the redo stack when a new change is made
    this.redoStack = [];
  }

  get_previous_state(): T[] | null {
    if (this.historyStack.length > 0) {
      const lastState = this.historyStack.pop();
      if (lastState) {
        this.redoStack.push(lastState); // Save current state to redo stack
        return JSON.parse(lastState);
      }
    }
    return null;
  }

  get_next_state(): T[] | null {
    if (this.redoStack.length > 0) {
      const nextState = this.redoStack.pop();
      if (nextState) {
        this.historyStack.push(nextState); // Save current state to history stack
        return JSON.parse(nextState);
      }
    }
    return null;
  }
  clear(): void {
    this.historyStack = [];
    this.redoStack = [];
  }
}
export default HistoryManager;
