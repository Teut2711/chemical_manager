import ChemicalBuilder from "./chemicalBuilder";
import data from "./data.json";
import HistoryManager from "./historyManager";

class ChemicalTableManager {
  private tableBody: HTMLElement;
  private chemicals: Chemical[] = [];
  private historyManager: HistoryManager<Chemical>;
  private autoSaveInterval: number = 5000; // 5 seconds

  constructor(tableBodySelector: string) {
    this.tableBody = document.querySelector(tableBodySelector)!;
    this.historyManager = new HistoryManager<Chemical>(30);
    this.fetchData();
    this.renderTable();
    this.startAutoSave();
  }
  public performUpShift(): void {
    const selectedRows = this.getSelectedRows();

    for (const index of selectedRows) {
      const currentIndex = index % this.chemicals.length;
      const previousIndex =
        (index - 1 + this.chemicals.length) % this.chemicals.length;
      [this.chemicals[currentIndex], this.chemicals[previousIndex]] = [
        this.chemicals[currentIndex],
        this.chemicals[previousIndex],
      ];
    }
    this.historyManager.saveState(this.chemicals);
    this.renderTable();
  }

  public performDownShift(): void {
    const selectedRows = this.getSelectedRows();
    console.log(selectedRows);
    for (let i = selectedRows.length - 1; i >= 0; i--) {
      const index = selectedRows[i];
      const currentIndex = index % this.chemicals.length;
      const next_index = (index + 1) % this.chemicals.length;
      [this.chemicals[currentIndex], this.chemicals[next_index]] = [
        this.chemicals[next_index],
        this.chemicals[currentIndex],
      ];
    }
    this.historyManager.saveState(this.chemicals); // Save state after shift
    this.renderTable(); // Re-render table
  }

  public sortBy(columnIndex: number, order: string = "asc"): void {
    if (columnIndex < 1) {
      return;
    }
    columnIndex -= 1;

    const columns: (keyof Chemical)[] = [
      "index",
      "name",
      "vendor",
      "density",
      "viscosity",
      "packaging",
      "packSize",
      "unit",
      "quantity",
    ];

    const columnKey = columns[columnIndex];

    this.chemicals.sort((row1, row2) => {
      const valueA = row1[columnKey];
      const valueB = row2[columnKey];

      if (typeof valueA === "string" && typeof valueB === "string") {
        if (order == "asc") {
          return valueA.localeCompare(valueB);
        } else if (order == "desc") {
          return valueB.localeCompare(valueA);
        } else {
          throw new Error("Option not supported");
        }
      } else {
        return order == "asc"
          ? (valueA as number) - (valueB as number)
          : order == "desc"
          ? (valueB as number) - (valueA as number)
          : 0;
      }
    });

    this.historyManager.saveState(this.chemicals);
    this.renderTable();
  }

  public performDeletes(): void {
    const selectedRows = this.getSelectedRows();
    for (let i = selectedRows.length - 1; i >= 0; i--) {
      const index = selectedRows[i];
      this.chemicals.splice(index, 1);
      this.tableBody.removeChild(this.tableBody.children[index]);
    }
    this.historyManager.saveState(this.chemicals);
    this.renderTable();
  }

  public performReset(): void {
    // Clear the current chemicals array
    this.chemicals = [];

    this.fetchData().then(() => {
      this.renderTable(); // Re-render the table after fetching data
    });

    this.historyManager.clear();
  }

  public performUndo(): void {
    const lastState = this.historyManager.get_previous_state();
    if (lastState) {
      this.chemicals = lastState; // Restore last state
      this.renderTable();
    }
  }

  public performRedo(): void {
    const nextState = this.historyManager.get_next_state();
    if (nextState) {
      this.chemicals = nextState; // Restore next state
      this.renderTable(); // Re-render the table
    }
  }

  public addRow(): void {
    const index = this.chemicals.length ;
    const newChemical = new ChemicalBuilder().setIndex(index).build();
    this.chemicals.push(newChemical);
    this.tableBody.appendChild(this.createRow(index, newChemical));
  }

  public selectAllRows(): void {
    this.toggleSelectAll(true);
  }

  public deselectAllRows(): void {
    this.toggleSelectAll(false);
  }
  public getCSV(): string {
    const headers = [
      "Name",
      "Vendor",
      "Density",
      "Viscosity",
      "Packaging",
      "Pack Size",
      "Unit",
      "Quantity",
    ];
    const rows = this.chemicals.map((chemical) => [
      chemical.name,
      chemical.vendor,
      chemical.density,
      chemical.viscosity,
      chemical.packaging,
      chemical.packSize,
      chemical.unit,
      chemical.quantity,
    ]);

    // Combine headers and rows into CSV format
    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    return csvContent;
  }

  private async fetchData(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.chemicals = JSON.parse(JSON.stringify(data)) as Chemical[]; // Deepcopy trick :https://developer.mozilla.org/en-US/docs/Glossary/Deep_copy
      resolve();
    });
  }

  private renderTable(): void {
    this.tableBody.replaceChildren(); // Trick: remove all children
    this.chemicals.forEach((chemical: Chemical, index: number) => {
      const row = this.createRow(index, chemical);
      this.tableBody.appendChild(row);
    });
  }

  private createRow(index: number, chemical?: Chemical): HTMLElement {
    const template = document.getElementById(
      "chemical-row-template"
    ) as HTMLTemplateElement;
    const row = template.content.cloneNode(true) as HTMLElement;

    const cells = row.querySelectorAll(
      ".chemical-supplies__table-body-cell"
    ) as NodeListOf<HTMLElement>;
    cells[1].textContent = `${(chemical?.index as number) + 1}.`;
    cells[2].textContent = `${chemical?.name}`;
    cells[3].textContent = `${chemical?.vendor}`;
    cells[4].textContent = `${chemical?.density.toFixed(2)}`;
    cells[5].textContent = `${chemical?.viscosity.toFixed(2)}`;
    cells[6].textContent = `${chemical?.packaging}`;
    cells[7].textContent = `${chemical?.packSize}`;
    cells[8].textContent = `${chemical?.unit}`;
    cells[9].textContent = `${chemical?.quantity.toFixed(2)}`;

    // Add event listeners to make cells editable on focus
    cells.forEach((cell, cellIndex) => {
      cell.setAttribute("tabindex", "0"); // Make cells focusable
      cell.addEventListener("focus", () => this.makeEditable(cell));
      cell.addEventListener("blur", () =>
        this.saveChanges(cell, cellIndex, index)
      );
    });

    return row;
  }

  private makeEditable(cell: HTMLElement): void {
    cell.setAttribute("contenteditable", "true");
    cell.focus();
  }
  private async syncTableDataWithState(): Promise<void> {
    const rows = this.tableBody.children as HTMLCollectionOf<HTMLElement>; // Get all row elements

    Array.from(rows).forEach((row, rowIndex) => {
      const cols = row.children as HTMLCollectionOf<HTMLElement>; // Get all columns for each row

      Array.from(cols).forEach((col, colIndex) => {
        this.saveChanges(col, colIndex, rowIndex); // Pass col, colIndex, and rowIndex
      });
    });
  }

  private saveChanges(
    cell: HTMLElement,
    cellIndex: number,
    rowIndex: number
  ): void {
    const newValue = cell.textContent || "";
    cell.removeAttribute("contenteditable");

    switch (cellIndex) {
      case 1: // Index
        const newIndex = parseInt(newValue) - 1;

        if (this.chemicals[rowIndex].index !== newIndex) {
          this.chemicals[rowIndex].index = newIndex;
        }
        break;

      case 2: // Name
        if (this.chemicals[rowIndex].name !== newValue) {
          this.chemicals[rowIndex].name = newValue;
        }
        break;

      case 3: // Vendor
        if (this.chemicals[rowIndex].vendor !== newValue) {
          this.chemicals[rowIndex].vendor = newValue;
        }
        break;
      case 4: // Density
        const newDensity = parseFloat(newValue);
        if (
          !isNaN(newDensity) &&
          this.chemicals[rowIndex].density !== newDensity
        ) {
          this.chemicals[rowIndex].density = newDensity;
        }
        break;
      case 5: // Viscosity
        const newViscosity = parseFloat(newValue);
        if (
          !isNaN(newViscosity) &&
          this.chemicals[rowIndex].viscosity !== newViscosity
        ) {
          this.chemicals[rowIndex].viscosity = newViscosity;
        }
        break;
      case 6: // Packaging
        if (this.chemicals[rowIndex].packaging !== newValue) {
          this.chemicals[rowIndex].packaging = newValue;
        }
        break;
      case 7: // Pack Size
        const newPackSize = parseInt(newValue);

        if (this.chemicals[rowIndex].packSize !== newPackSize) {
          this.chemicals[rowIndex].packSize = newPackSize;
        }
        break;
      case 8: // Unit
        if (this.chemicals[rowIndex].unit !== newValue) {
          this.chemicals[rowIndex].unit = newValue;
        }
        break;
      case 9: // Quantity
        const newQuantity = parseFloat(newValue);
        if (
          !isNaN(newQuantity) &&
          this.chemicals[rowIndex].quantity !== newQuantity
        ) {
          this.chemicals[rowIndex].quantity = newQuantity;
        }
        break;
    }
  }

  private startAutoSave(): void {
    setInterval(() => {
      Promise.all([
        this.historyManager.saveState(this.chemicals),
        this.syncTableDataWithState(),
      ]);
    }, this.autoSaveInterval);
  }

  private getSelectedRows(): number[] {
    const selectedIndices: number[] = [];
    console.log("Selected indices: " + JSON.stringify(selectedIndices));

    this.tableBody
      .querySelectorAll<HTMLInputElement>(".chemical-supplies__checkbox")
      .forEach((checkbox, index) => {
        if (checkbox.checked) {
          selectedIndices.push(index);
        }
      });
    return selectedIndices;
  }
  private toggleSelectAll(shouldSelect: boolean): void {
    const checkboxes = this.tableBody.querySelectorAll<HTMLInputElement>(
      ".chemical-supplies__checkbox"
    );

    checkboxes.forEach((checkbox) => {
      checkbox.checked = shouldSelect;
    });
  }
}
export default ChemicalTableManager;
