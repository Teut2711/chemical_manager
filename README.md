## Chemical Supplies Table Manager

This project provides an interactive web application for managing a list of chemical supplies. Users can add, edit, delete, and reorder chemicals, with features like undo/redo, sorting, and CSV export. The project is built using TypeScript, SCSS, and follows BEM naming conventions for styling.

### Features

* **Add Chemical Rows:** Add new chemicals dynamically to the table.
* **Edit Rows:** Edit any cell in the table for updating chemical information.
* **Row Selection:** Select rows using checkboxes for batch actions.
* **Reorder Rows:** Move selected rows up or down in the table.
* **Delete Rows:** Remove selected rows from the table.
* **Undo/Redo:** Undo and redo actions for managing changes.
* **Sorting:** Sort columns by clicking the header arrows with ascending/descending options.
* **CSV Export:** Download the table data as a CSV file for further analysis.
* **Auto-Save:** The table state is automatically saved every 20 seconds to prevent data loss.

### Table Structure

The table displays the following columns for each chemical:

* **Index:** Auto-incremented index for each chemical row.
* **Name:** Name of the chemical.
* **Vendor:** Supplier or vendor for the chemical.
* **Density:** Density of the chemical (in g/cm³).
* **Viscosity:** Viscosity of the chemical (in cP).
* **Packaging:** Type of packaging (e.g., bottle, drum).
* **Pack Size:** Size of the pack (number of units).
* **Unit:** The unit of measurement (e.g., liters, grams).
* **Quantity:** The quantity of the chemical in stock.

### Project Structure

* `index.html`: The HTML file defining the table structure and template.
* `style.scss`: The SCSS file for styling the table using BEM naming conventions.
* `chemicalTableManager.ts`: The main TypeScript class that handles all table operations.
* `historyManager.ts`: A utility class for managing undo/redo states.
* `chemicalBuilder.ts`: A builder class for creating new chemical entries.
* `data.json`: Sample data for the initial chemical list.

### Installation & Setup

1. **Clone the Repository:**

```bash
git clone https://github.com/your-repo/chemical-supplies-manager.git
cd chemical-supplies-manager
```

2. **Install Dependencies:** 
   Ensure you have Node.js and npm installed. Run:

```bash
npm install
```

3. **Build the Project:** 
   This project uses Vite for bundling. To build the project, run:

```bash
npm run build
```

4. **Start the Development Server:** 
   To start the development server, use:

```bash
npm run dev
```

5. **Open in Browser:** 
   Navigate to http://localhost:3000 in your web browser to interact with the Chemical Supplies Table.

### Usage

* **Adding Rows:** Click the "Add" button to append a new chemical to the table.
* **Editing Rows:** Click any cell to edit its value. Changes are saved automatically when the cell loses focus.
* **Sorting:** Use the up and down arrows on column headers to sort the table.
* **Reordering:** Select rows using checkboxes, then use the "Move Up" and "Move Down" buttons to reorder the rows.
* **Undo/Redo:** Use the undo and redo buttons to revert or reapply changes.
* **Exporting Data:** Click "Save as CSV" to download the table contents in CSV format.

### Contributing

We welcome pull requests! Please ensure your code follows the existing style and conventions (BEM for class names, TypeScript for logic).

### License

This project is open source and available under the MIT License.
