import colors from "colors";
import fs from "node:fs";
import path from "node:path";
import { JSON_OUTPUT } from "./config";
import { extractCurrentCategoryFields, extractFieldsConfigFromFieldsArray } from "./tools/parsing-tools";
colors.enable();


/**
 * The html file base name without ".html" extension
 */
const FILE_NAME = "american_services";

extractCurrentCategoryFields(FILE_NAME).then(({ $, fields }) => {
  const fieldsResult = extractFieldsConfigFromFieldsArray($, fields);
  // export the result to a file: ./forms/as-fields.json
  fs.writeFileSync(
    path.join(JSON_OUTPUT, `${FILE_NAME}.json`),
    JSON.stringify(
      fieldsResult.map((field) => ({ ...field, el: "cheerio element" })),
      null,
      2
    )
  );
});