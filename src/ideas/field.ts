type InputFieldType = "text" | "password" | "email" | "tel" | "url" | "number" | "range" | "date" | "checkbox" | "radio" | "file"

/**
 * dynamic input element wrapper
 * @wip number and date need to process correct value types
 * @wip checkbox and radio use .checked not .value
 * @wip radio gets grouped via the name attribute
 * @wip the boolean guys have value set as an attribute
 */
export class InputField {
    public readonly element: HTMLInputElement;
    private _value: string = "";
    public constructor(placeholder: string, type: InputFieldType = "text") {
        this.element = document.createElement('input');
        this.element.type = type;
        this.element.placeholder = placeholder;
    }

    public get value() {
        return this._value;
    }

    public set value(input: string | number | Date) {
        const text = String(input);
        
        this._value = text; //wip
        if (this.element.value !== text) {
            this.element.value = text;
        }
    }

    public activate() {
        this.element.oninput = () => {
            this.value = this.element.value.trim();
        }
    }

    public deactivate() {
        this.element.oninput = null;
    }

}