import "./style.scss";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ChemicalTableManager from "./chemicalManager";

function debounce(func: (event: KeyboardEvent) => void, delay: number = 300) {
  let timeout: ReturnType<typeof setTimeout>;

  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(func, delay);
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const chemicalTable = new ChemicalTableManager(
    ".chemical-supplies__table-body"
  );

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
      chemicalTable.performReset();
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

  document.addEventListener(
    "keydown",
    debounce((event: KeyboardEvent) => {
      // Immediate action for undo/redo
      if (event.ctrlKey && event.key === "z") {
        chemicalTable.performUndo();
      } else if (event.ctrlKey && event.key === "y") {
        chemicalTable.performRedo();
      } else {
        const activeCell = document.activeElement as HTMLTableCellElement;
        const cellIndex = activeCell?.cellIndex as number; // assuming cellIndex is stored here
        const rowIndex = (activeCell?.parentElement as HTMLTableRowElement)
          ?.rowIndex as number; // assuming rowIndex is stored here

        if (activeCell && cellIndex !== undefined && rowIndex !== undefined) {
          chemicalTable.saveChanges(
            activeCell.textContent || "",
            cellIndex,
            rowIndex
          );
        }
      }
    })
  );

  document
    .querySelector(
      ".chemical-supplies__table-header-cell > .chemical-supplies__checkbox"
    )
    ?.addEventListener("change", (e) => {
      const checkbox = e.target as HTMLInputElement;
      if (checkbox.checked) {
        chemicalTable.selectAllRows();
      } else {
        chemicalTable.deselectAllRows();
      }
    });

  document
    .querySelector(".chemical-supplies__table-header-labels")
    ?.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;

      if (target.classList.contains("arrow-up")) {
        let headerCell = target.closest("th") as HTMLTableCellElement;
        chemicalTable.sortBy(headerCell.cellIndex, "asc");
      } else if (target.classList.contains("arrow-down")) {
        let headerCell = target.closest("th") as HTMLTableCellElement;
        chemicalTable.sortBy(headerCell.cellIndex, "desc");
      }
    });
});
