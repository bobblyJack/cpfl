/**
 * accepted html input element types
 * @tbd blob "file"
 * @tbd select "radio"
 */ 
type FieldInputType = FieldInputTypeSelect | FieldInputTypeBoolean | FieldInputTypeString | FieldInputTypeNumber | FieldInputTypeDate
type FieldInputTypeSelect = "select-one" | "select-multiple"
type FieldInputTypeBoolean = "checkbox"
type FieldInputTypeString = "text" | "email" | "url" | "password" | "tel" | "search"
type FieldInputTypeNumber = "number" | "range"
type FieldInputTypeDate = "date" | "month" | "week"

/**
 * types for parsing field values
 */
type FieldOutputType = string | number | boolean | Date;

/**
 * basic field interface (for indexing)
 */
interface FieldData<T extends FieldOutputType> {
    value: T | null;
    label: string;
    name?: string;
    type: FieldInputType;
}