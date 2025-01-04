import {
  load,
  type CheerioAPI
} from "cheerio";
import colors from "colors";
import jsmTreeify from "jsm-treeify";
import fs from "node:fs";
import path from "node:path";
import {
  TCategory,
  TField
} from "./typing";
import { HTML_SOURCE_FOLDER, JSON_OUTPUT } from "../config";
colors.enable();


/**
 * Using this function we will extract all the fields from the form
 */
export const extractCurrentCategoryFields = async (filePath: string) => {
  
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

export function extractFieldsConfigFromFieldsArray(
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

    console.log("Extracted field".gray, jsmTreeify(field));
    fieldObject.field = field;
    result.push({ ...fieldObject });
  }

  console.log("Returning the result".gray, typeof result);
  return result;
}
