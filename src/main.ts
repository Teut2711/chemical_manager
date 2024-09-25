import "./style.scss";
import "@fortawesome/fontawesome-free/css/all.min.css";
import data from "./data.json";
import HistoryManager from "./history";

const chemicalDataBuilder = function (
  name = "Unnamed Chemical",
  vendor = "",
  density = 0,
  viscosity = 0,
  packaging = "N/A",
  pack_size = 0,
  unit = "units",
  quantity = 0
) {
  return {
    name,
    vendor,
    density,
    viscosity,
    packaging,
    pack_size,
    unit,
    quantity,
  };
};

class ChemicalTableManager {
  private tableBody: HTMLElement;
  private chemicals: Chemical[] = [];
  private historyManager: HistoryManager<Chemical>;
  private autoSaveInterval: number = 20000; // 20 seconds

  constructor(tableBodySelector: string) {
    this.tableBody = document.querySelector(tableBodySelector)!;
    this.historyManager = new HistoryManager<Chemical>(8);
    this.startAutoSave();
  }

  public performUpShift(): void {
    const selectedRows = this.getSelectedRows();
    selectedRows.forEach((index) => {
      if (index > 0) {
        [this.chemicals[index], this.chemicals[index - 1]] = [
          this.chemicals[index - 1],
          this.chemicals[index],
        ];
      }
    });
    this.historyManager.saveState(this.chemicals);
    this.renderTable();
  }

  public performDownShift(): void {
    const selectedRows = this.getSelectedRows();
    for (let i = selectedRows.length - 1; i >= 0; i--) {
      const index = selectedRows[i];
      if (index < this.chemicals.length - 1) {
        [this.chemicals[index], this.chemicals[index + 1]] = [
          this.chemicals[index + 1],
          this.chemicals[index],
        ];
      }
    }
    this.historyManager.saveState(this.chemicals); // Save state after shift
    this.renderTable(); // Re-render table
  }

  public performDeletes(): void {
    const selectedRows = this.getSelectedRows();
    for (let i = 0; i < selectedRows.length; i++) {
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

    // Optionally, you can also reset the history manager state
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
    const newChemical = chemicalDataBuilder() as Chemical;
    this.tableBody.appendChild(
      this.createRow(this.chemicals.length, newChemical)
    );
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
      chemical.density.toString(),
      chemical.viscosity.toString(),
      chemical.packaging,
      chemical.pack_size,
      chemical.unit,
      chemical.quantity.toString(),
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
    this.tableBody.replaceChildren();
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

    cells[1].textContent = `${index + 1}. ${chemical?.name}`;
    cells[2].textContent = `${chemical?.vendor}`;
    cells[3].textContent = `${chemical?.density.toFixed(2)}`;
    cells[4].textContent = `${chemical?.viscosity.toFixed(2)}`;
    cells[5].textContent = `${chemical?.packaging}`;
    cells[6].textContent = `${chemical?.pack_size}`;
    cells[7].textContent = `${chemical?.unit}`;
    cells[8].textContent = `${chemical?.quantity.toFixed(2)}`;

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
  private saveChanges(
    cell: HTMLElement,
    cellIndex: number,
    rowIndex: number
  ): void {
    const newValue = cell.textContent || "";
    cell.removeAttribute("contenteditable");

    switch (cellIndex) {
      case 2: // Vendor
        if (this.chemicals[rowIndex].vendor !== newValue) {
          this.chemicals[rowIndex].vendor = newValue;
        }
        break;
      case 3: // Density
        const newDensity = parseFloat(newValue);
        if (
          !isNaN(newDensity) &&
          this.chemicals[rowIndex].density !== newDensity
        ) {
          this.chemicals[rowIndex].density = newDensity;
        }
        break;
      case 4: // Viscosity
        const newViscosity = parseFloat(newValue);
        if (
          !isNaN(newViscosity) &&
          this.chemicals[rowIndex].viscosity !== newViscosity
        ) {
          this.chemicals[rowIndex].viscosity = newViscosity;
        }
        break;
      case 5: // Packaging
        if (this.chemicals[rowIndex].packaging !== newValue) {
          this.chemicals[rowIndex].packaging = newValue;
        }
        break;
      case 6: // Pack Size
        if (this.chemicals[rowIndex].pack_size !== newValue) {
          this.chemicals[rowIndex].pack_size = newValue;
        }
        break;
      case 7: // Unit
        if (this.chemicals[rowIndex].unit !== newValue) {
          this.chemicals[rowIndex].unit = newValue;
        }
        break;
      case 8: // Quantity
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
      this.historyManager.saveState(this.chemicals); // Auto-save current state every 20 seconds
      console.log(
        "Auto-saved state:",
        JSON.parse(JSON.stringify(this.chemicals))
      );
    }, this.autoSaveInterval);
  }

  async init(): Promise<void> {
    await this.fetchData();
    this.renderTable();
  }

  private getSelectedRows(): number[] {
    const selectedIndices: number[] = [];
    this.tableBody
      .querySelectorAll(".chemical-supplies__table-body-row")
      .forEach((row, index) => {
        if (row.classList.contains("selected")) {
          // Assuming you add a "selected" class to selected rows
          selectedIndices.push(index);
        }
      });
    return selectedIndices;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const chemicalTable = new ChemicalTableManager(
    ".chemical-supplies__table-body"
  );
  chemicalTable.init();

  // Event listeners for button clicks
  document
    .querySelector(".chemical-supplies__button-add")!
    .addEventListener("click", () => {
      chemicalTable.addRow();
    });

  document
    .querySelector(".chemical-supplies__button-move-up")!
    .addEventListener("click", () => {
      chemicalTable.performUpShift();
    });

  document
    .querySelector(".chemical-supplies__button-move-down")!
    .addEventListener("click", () => {
      chemicalTable.performDownShift();
    });

  document
    .querySelector(".chemical-supplies__button-delete")!
    .addEventListener("click", () => {
      chemicalTable.performDeletes();
    });

  document
    .querySelector(".chemical-supplies__button-reset")!
    .addEventListener("click", () => {
      // Implement reset logic here
    });
  document
    .querySelector(".chemical-supplies__button-save")!
    .addEventListener("click", () => {
      const csvStr = chemicalTable.getCSV();
      const blob = new Blob([csvStr], { type: "text/csv" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "chemicals.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

  document
    .querySelector(".chemical-supplies__button-reset")!
    .addEventListener("click", () => {
      chemicalTable.performReset();
    });

  // Example: Adding keyboard shortcuts for undo/redo
  document.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === "z") {
      chemicalTable.performUndo();
    } else if (
      (event.ctrlKey && event.key === "y") ||
      (event.ctrlKey && event.shiftKey && event.key === "z")
    ) {
      chemicalTable.performRedo();
    }
  });
});
