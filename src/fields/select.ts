import { HTMLDropFieldElement } from "./options";

interface SelectFieldData<T extends string> extends FieldData<T> {
    multiple?: boolean;
    options?: [T, string?][];
}

/**
 * dropdown text fields
 * @wip select-multiple
 * @tbd radio groups
 */
export class SelectField<T extends string> extends HTMLDropFieldElement<T, FieldInputTypeSelect> {
    protected _field!: HTMLSelectElement;
    public constructor(data: SelectFieldData<T>) {
        const type: FieldInputTypeSelect = data.multiple ? "select-multiple" : "select-one";
        super(type, data);

        this._list = this._field;

        const blank = this.createOption("" as T, "...");
        blank.disabled = true;
        if (data.options) {
            for (const option of data.options) {
                this.createOption(option[0], option[1]);
            }
        }
        if (!data.value) {
            blank.selected = true;
        } else {
            this.value = data.value;
        }
    }
    
}