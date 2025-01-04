export type TCategory = {
  name: string;
  description: string;
  children: TCategory[];
}

export type TFieldType = "text" | "integer" | "float" | "radioBox" | "checkBox" | "select" | "boolean" | "fileUpload";

export type TOperator =
  | "eq"
  | "ne"
  | "gt"
  | "lt"
  | "gte"
  | "lte"
  | "in"
  | "nin"
  | "exists"
  | "not_empty";
export type TConstraint<Operator extends TOperator> = Operator extends
  | "eq"
  | "ne"
  | "gt"
  | "lt"
  | "gte"
  | "lte"
  ? {
      field: string;
      operator: Operator;
      value: any;
    }
  : Operator extends "in" | "nin"
  ? {
      field: string;
      operator: Operator;
      value: any[];
    }
  : Operator extends "exists" | "not_empty"
  ? {
      field: string;
      operator: Operator;
    }
  : never;

export type TField = {
  type: TFieldType;
  config: {
    label?: string;
    default_value?: string | number;
    /**
     * Choices property applies on "radioBox" | "checkBox" | "select" field types
     */
    choices?: {
      value: number | string;
      label: string;
      default_selected: boolean;
    }[];

    /**
     * This property indicates if the field appears on the UI or not
     */
    constraints?: TConstraint<TOperator>[];
  };
};

export type TOutputDatum = {
  cateagories: TCategory[];

  category_fields: {
    category_name: string;
    fields: TField[];
  };
};