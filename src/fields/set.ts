import { InputField } from "./input";

export function createFieldSet(legend: string) {
    const set = document.createElement('fieldset');
    const leg = document.createElement('legend');
    leg.textContent = legend;
    set.appendChild(leg);
    return set;
}

export class BooleanFieldSet {
    private _block: HTMLFieldSetElement;
    private _inputs: InputField[];
    public constructor(label: string, type: HTMLInputTypeBoolean, options: FieldOptionData[], specificName?: string) {
        this._block = createFieldSet(label);
        const name = specificName ? specificName : label.replace(/ /g, "");
    
        this._inputs = options.map((option) => {
            const field = new InputField(option[1] || "", {
                inputType: type,
                specifiedName: name
            });
            this._block.appendChild(field.block);
            return field;
        });
    }

    public get block() {
        return this._block;
    }

    public get inputs() {
        return this._inputs;
    }

    public get value() {
        for (const input of this._inputs) {
            if (input.checked) {
                return input.value;
            }
        }
        return "";
    }
    public set value(value: string) {
        for (const input of this._inputs) {
            if (input.value === value) {
                input.checked = true;
                break;
            }
        }
    }
}