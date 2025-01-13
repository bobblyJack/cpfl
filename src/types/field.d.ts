/**
 * accepted html input element types
 */ 
type HTMLInputType = HTMLInputTypeBoolean | HTMLInputTypeDate | HTMLInputTypeNumber | HTMLInputTypeText | HTMLInputTypeBlob
type HTMLInputTypeBoolean = "checkbox" | "radio"
type HTMLInputTypeDate = "date" | "month" | "week"
type HTMLInputTypeText = "text" | "email" | "url" | "password" | "tel" | "search"
type HTMLInputTypeNumber = "number" | "range"
type HTMLInputTypeBlob = "file" // ignore this for now tbh

interface InputFieldParams {
    inputType: HTMLInputType;
    labelPosition?: "before" | "after" | "placeholder";
    insertBreak?: boolean;
    dataList?: string[];
    specifiedName?: string;
}

type FieldOptionData = [string, string?]; // value, display label

interface DropFieldParams {
    labelPosition?: "before" | "above";
    optionsList?: FieldOptionData[];
    matchedLabels?: boolean;
    selectedIndex?: number;
    specifiedName?: string;
}

/**
 * what i actually need here!
 * an interface (or interfaces)
 * that i can hydrate from stored info to create dynamic field classes
 * a button is probably not necessary cause it doesn't need to be stored
 * it's just stuff that needs to be stored.
 * that should provide some clarity.
 * also, don't worry about coding in options for looks
 * make a cohesive default look and stick to that.
 * definitely need to define the fields by expected outputs i think.
 */