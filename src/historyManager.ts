import { OrderedSet } from "immutable";

class HistoryManager<T> {
  private historyStack: OrderedSet<string>;
  private redoStack: OrderedSet<string>;
  private maxStackSize: number;

  constructor(maxStackSize: number) {
    this.maxStackSize = maxStackSize;
    this.historyStack = OrderedSet();
    this.redoStack = OrderedSet();
  }

  async saveState(state: T[]): Promise<void> {
    const serializedState = JSON.stringify(state);

    // Add new state directly, OrderedSet will ensure uniqueness
    this.historyStack = this.historyStack.add(serializedState);

    // Limit the stack size
    if (this.historyStack.size > this.maxStackSize) {
      this.historyStack = this.historyStack.delete(this.historyStack.first());
    }
 
  }

  get_previous_state(): T[] | null {
    if (this.historyStack.size > 0) {
      const lastState = this.historyStack.last();
      if (lastState) {
        this.redoStack = this.redoStack.add(lastState); // Save current state to redo stack
        this.historyStack = this.historyStack.delete(lastState);
        return JSON.parse(lastState);
      }
    }
    return null;
  }

  get_next_state(): T[] | null {
    if (this.redoStack.size > 0) {
      const nextState = this.redoStack.last();
      if (nextState) {
        this.historyStack = this.historyStack.add(nextState); // Save current state to history stack
        this.redoStack = this.redoStack.delete(nextState);
        return JSON.parse(nextState);
      }
    }
    return null;
  }

  clear(): void {
    this.historyStack = OrderedSet();
    this.redoStack = OrderedSet();
  }
}

export default HistoryManager;
