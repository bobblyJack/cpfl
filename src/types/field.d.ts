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