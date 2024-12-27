# nd_project

## Description
This project processes HTML forms to extract field configurations, categorize them, and save the structured data in JSON format. It leverages Node.js and TypeScript along with various libraries for HTML parsing, data manipulation, and logging.

### Core Functionalities
1. **Field Extraction**
   - Extracts fields from an HTML form file based on its structure.
   - Identifies category-specific fields (e.g., "Product Type").

2. **Field Configuration**
   - Configures fields based on the presence of inputs or select elements within the HTML structure.
   - Handles input and select elements to build field configurations, including labels and choices for select fields.

3. **Data Export**
   - Saves the extracted fields into a JSON file for further processing or integration.

## Code Logic Breakdown

### `extractCurrentCategoryFields`
This function extracts fields from a specified HTML file.
- **Input**: `fileName` (string) - The name of the HTML file (without extension).
- **Process**:
  1. Checks if the file exists.
  2. Reads and parses the HTML content using `cheerio`.
  3. Finds and processes fields within `div.row` elements.
  4. Identifies category fields (e.g., fields labeled as "Product Type:").
- **Output**: An object containing the parsed Cheerio API instance (`$`) and an array of fields with metadata.

### `extractFieldsConfigFromFieldsArray`
This function processes the extracted fields to build their configurations.
- **Input**:
  - `$`: Cheerio API instance for parsing HTML.
  - `fields`: Array of field metadata from `extractCurrentCategoryFields`.
- **Process**:
  1. Iterates through each field object.
  2. Checks the label for proper formatting (removing trailing colons, etc.).
  3. Initializes a default field configuration object.
  4. Determines the field type based on the presence of input or select elements.
  5. Populates additional configurations (e.g., choices for select fields).
- **Output**: An array of processed field objects with configurations.

### Main Script
1. **Execution**: The script processes a predefined HTML file (`american_services.html`).
2. **Steps**:
   - Calls `extractCurrentCategoryFields` to extract fields.
   - Processes these fields using `extractFieldsConfigFromFieldsArray`.
   - Exports the resulting field configuration as a JSON file to `forms/json`.

## Project Setup

### Prerequisites
- Node.js (version 18+ recommended)
- npm or yarn package manager
- TypeScript

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd nd_project
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Project Structure
- **index.ts**: Main script for field extraction and configuration.
- **forms/html-form-files/**: Directory for HTML files to process.
- **forms/json/**: Directory where JSON outputs are saved.
- **tools/typing.ts**: Type definitions used throughout the project.

### Running the Project
1. Add the HTML file to `forms/html-form-files/`.
2. Update the `FILE_NAME` constant in `index.ts` to match the file name (without extension).
3. Run the script:
   ```bash
   npm run run
   ```
4. Check the output in `forms/json/` for the generated JSON file.

## Development and Debugging
- **Scripts**:
  - `npm run run`: Executes the main script using `tsx`.
- **Linting**: Ensure code quality with ESLint:
  ```bash
  npx eslint .
  ```
- **Prettier**: Format code for consistency:
  ```bash
  npx prettier --write .
  ```
- **TypeScript Compilation**: Verify type correctness:
  ```bash
  npx tsc
  ```

## Libraries Used
- [cheerio](https://github.com/cheeriojs/cheerio): Parses and manipulates HTML.
- [colors](https://github.com/Marak/colors.js): Adds color to console output.
- [js-beautify](https://github.com/beautify-web/js-beautify): Beautifies HTML content.
- [tsx](https://github.com/esbuild-kit/tsx): Enables seamless TypeScript execution.

## Contribution
1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit changes and push:
   ```bash
   git commit -m "Add new feature"
   git push origin feature-name
   ```
4. Create a pull request.

## Notes
- Ensure all files in `forms/html-form-files/` are valid HTML.
- Add additional type definitions in `tools/typing.ts` if needed.

## License
This project is licensed under the MIT License.

