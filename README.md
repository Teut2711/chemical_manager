Chemical Supplies Table Manager
Overview

This project provides an interactive table for managing a list of chemical supplies. Users can add, edit, delete, and reorder rows representing different chemicals. The table supports undo/redo functionality, sorting by columns, and exporting the data to CSV. It is built using TypeScript, SCSS, and follows the BEM naming convention for styling.
Features

    Add Chemical Rows: Dynamically add new chemicals to the table.
    Edit Rows: Each cell in the table is editable; clicking a cell allows changes to be made.
    Row Selection: Rows can be selected using checkboxes, enabling batch actions.
    Reorder Rows: Move selected rows up or down in the table.
    Delete Rows: Delete selected rows from the table.
    Undo/Redo: Undo and redo actions for managing state changes.
    Sorting: Sort columns by ascending or descending order.
    CSV Export: Export the table data as a CSV file.
    Auto-Save: Table state is auto-saved every 5 seconds to prevent data loss.

Table Structure

The table contains the following columns:

    Index: Auto-incremented index of the chemical row.
    Name: Name of the chemical.
    Vendor: Supplier or vendor for the chemical.
    Density: Density of the chemical (in g/cm³).
    Viscosity: Viscosity of the chemical (in cP).
    Packaging: Type of packaging.
    Pack Size: Size of the pack (number of units).
    Unit: The unit of measurement (e.g., liters, grams).
    Quantity: The quantity of the chemical in stock.

Project Structure

    index.html: The HTML file defining the table structure and template.
    style.scss: The SCSS file for styling the table using BEM naming conventions.
    chemicalTableManager.ts: The main TypeScript class that handles all table operations.
    historyManager.ts: A utility class for managing undo/redo states.
    chemicalBuilder.ts: A builder class for creating new chemical entries.
    data.json: Sample data for the initial chemical list.

Installation & Setup

    Clone the repository:

    bash

git clone https://github.com/your-repo/chemical-supplies-manager.git
cd chemical-supplies-manager

Install Dependencies: Make sure you have Node.js and npm installed. Run:

bash

npm install

Build the Project: This project uses Vite for bundling. To build the project, run:

bash

npm run build

Start the Development Server: To start the development server, use:

bash

    npm run dev

    Open in Browser: Navigate to http://localhost:3000 in your web browser to interact with the Chemical Supplies Table.

Usage

    Adding Rows: Click the "Add" button to append a new chemical to the table.
    Editing Rows: Click any cell to edit its value. Changes are saved automatically when the cell loses focus.
    Sorting: Use the up and down arrows on column headers to sort the table.
    Reordering: Select rows using checkboxes, then use the "Move Up" and "Move Down" buttons to reorder the rows.
    Undo/Redo: Use the undo and redo buttons to revert or reapply changes.
    Exporting Data: Click "Save as CSV" to download the table contents in CSV format.

Contributing

Feel free to submit pull requests if you'd like to contribute to the project! Please ensure that your code follows the existing style and conventions (BEM for class names, TypeScript for logic).
License

This project is open source and available under the MIT License.