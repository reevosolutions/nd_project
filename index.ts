import fs from "node:fs";
import path from "node:path";
import colors from "colors";
import {
  type Cheerio,
  type AcceptedElems,
  load,
  type CheerioAPI,
} from "cheerio";
import { html as beautify } from "js-beautify";
import {
  TCategory,
  TFieldType,
  TOperator,
  TConstraint,
  TOutputDatum,
  TField,
} from "./tools/typing";
colors.enable();

/**
 * Using this function we will extract all the fields from the form
 */
const extractCurrentCategoryFields = async (fileName: string) => {
  const filePath = path.join(
    __dirname,
    `forms/html-form-files/${fileName}.html`
  );

  if (!fs.existsSync(filePath)) {
    console.error("File does not exist".red, filePath);
    throw new Error("File does not exist");
  }

  const pageHtml = fs.readFileSync(filePath, "utf8");

  const $ = load(pageHtml);

  console.log("executing extractCurrentCategoryFields".gray);

  const categories: TCategory[] = [];

  const fields: {
    index: number;
    label: string;
    is_category_field: boolean;
    field: TField | null;
    el: any;
  }[] = [];

  $("div.row").each((index, el) => {
    console.log(index);
    let is_category_field = false;

    const label = $(el)
      .find("div > strong > font > font, div > font > font")
      .text()
      .trim();
    console.log("Label".cyan, label);

    if (label === "Product Type:") {
      is_category_field = true;
      console.log("category field found".green);
    }
    fields.push({
      index: index,
      label,
      is_category_field,
      field: null,
      el: el,
    });
  });

  /**
   * Return the fields
   */
  return { $, fields };
};

function extractFieldsConfigFromFieldsArray(
  $: CheerioAPI,
  fields: {
    index: number;
    label: string;
    is_category_field: boolean;
    field: TField | null;
    el: any;
  }[]
) {
  console.log("executing extractFieldsConfigFromFieldsArray".gray);
  const result: {
    index: number;
    label: string;
    is_category_field: boolean;
    field: TField | null;
    el: any;
  }[] = [];
  for (const fieldObject of fields) {
    let sub_field_count = 1;
    console.log("extracting field of".gray, fieldObject.label);
    if (!fieldObject.label) continue;
    if (fieldObject.label.endsWith(":"))
      fieldObject.label = fieldObject.label.slice(0, -1).trim();
    /**
     * Initialize the default field object
     */
    const field: TField = {
      type: "text",
      config: {
        label: fieldObject.label,
      },
    };

    const $field = $(fieldObject.el)
      .find("div > input, div > select")
      .each((index, el) => {
        if (el.tagName === "select") {
          field.type = "select";
          field.config.choices = [];
          $(el)
            .find("option")
            .each((index, option) => {
              (field.config.choices || []).push({
                value: $(option).attr("value") || $(option).text().trim(),
                label: $(option).text().trim(),
                default_selected: $(option).attr("selected") === "selected",
              });
            });
        } else if (el.tagName === "input") {
          field.type = "text";
        }
      });

    console.log("Extracted field".gray, field);
    fieldObject.field = field;
    result.push({ ...fieldObject });
  }

  console.log("Returning the result".gray, typeof result);
  return result;
}

const FILE_NAME = "american_services";

extractCurrentCategoryFields(FILE_NAME).then(({ $, fields }) => {
  const fieldsResult = extractFieldsConfigFromFieldsArray($, fields);
  // export the result to a file: ./forms/as-fields.json
  fs.writeFileSync(
    path.join(__dirname, `forms/json/${FILE_NAME}.json`),
    JSON.stringify(
      fieldsResult.map((field) => ({ ...field, el: "cheerio element" })),
      null,
      2
    )
  );
});