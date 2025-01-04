import colors from "colors";
import fs from "node:fs";
import path from "node:path";
import { HTML_SOURCE_FOLDER, JSON_OUTPUT } from "./config";
import { extractCurrentCategoryFields, extractFieldsConfigFromFieldsArray } from "./tools/parsing-tools";
import jsmTreeify from "jsm-treeify";
import { last } from 'lodash';
import { Command } from 'commander';
import inquirer from 'inquirer';
import { glob } from 'glob';
import { listHtmlFiles } from "./tools/files";

colors.enable();


// /**
//  * The html file base name without ".html" extension
//  */

// if (process.argv.length < 3) {
//   console.error("Please provide the file name as an argument");
//   process.exit(1);
// }
// const argvFileName = last(process.argv);

// const FILE_NAME = last(process.argv) as string;

// extractCurrentCategoryFields(FILE_NAME).then(({ $, fields }) => {
//   const fieldsResult = extractFieldsConfigFromFieldsArray($, fields);
//   // export the result to a file: ./forms/as-fields.json
//   fs.writeFileSync(
//     path.join(JSON_OUTPUT, `${FILE_NAME}.json`),
//     JSON.stringify(
//       fieldsResult.map((field) => ({ ...field, el: "cheerio element" })),
//       null,
//       2
//     )
//   );

//   console.log(jsmTreeify(last(process.argv)));

// });




const program = new Command();


/**
 * CLI Command to select and parse a typing file
 */
program
  .command('parse')
  .description('Select an Html file to parse its structure')
  .action(async () => {
    // Step 1: List available .html files
    const htmlFiles = await listHtmlFiles(HTML_SOURCE_FOLDER);
    if (htmlFiles.length === 0) {
      console.log('❌ No .html files found in the specified directory.');
      return;
    }

    // Step 2: Ask user to choose a typing file
    const { selectedFile } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedFile',
        message: 'Select an html file to parse:',
        choices: htmlFiles,
      },
    ]);
    console.log(`📄 Selected file: `.magenta, path.join(HTML_SOURCE_FOLDER, selectedFile));

    // Step 3: Extract entity name from the filename
    const filePath = path.join(HTML_SOURCE_FOLDER, selectedFile);
    const { $, fields } = await extractCurrentCategoryFields(filePath);

    const fieldsResult = extractFieldsConfigFromFieldsArray($, fields);
    // export the result to a file: ./forms/as-fields.json
    fs.writeFileSync(
      path.join(JSON_OUTPUT, `${selectedFile.substring(0, selectedFile.length - 5)}.json`),
      JSON.stringify(
        fieldsResult.map((field) => ({ ...field, el: "cheerio element" })),
        null,
        2
      )
    );

    console.log(jsmTreeify(last(process.argv)));



    // end
    console.log();

  });

program.parse(process.argv);
program.action