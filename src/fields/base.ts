import { setUniqueID } from "./id";

export abstract class HTMLFieldElement<T extends FieldOutputType, U extends FieldInputType> implements FieldData<T> {
    protected _block: HTMLLabelElement;
    protected _label: HTMLSpanElement;
    protected _field: HTMLInputElement | HTMLSelectElement;

    public constructor(type: U, data: FieldData<T>) {
        
        this._block = document.createElement('label');
        this._label = document.createElement('span');

        if (type.includes('select')) {
            this._field = document.createElement('select');
            if (type === 'select-multiple') {
                this._field.multiple = true;
            }
        } else {
            this._field = document.createElement('input');
            this._field.type = type;
        }
        
        this._label.innerText = data.label;
        this._field.name = data.name ? data.name : data.label.replace(/ /g, "");

        if (type === 'checkbox') {
            this._block.appendChild(this._field);
            this._block.appendChild(this._label);
        } else {
            this._block.appendChild(this._label);
            this._block.appendChild(this._field);
        }

    }

    

    public get block(): HTMLLabelElement {
        return this._block;
    }

    public get label(): string {
        return this._label.innerText;
    }
    public set label(text: string) {
        this._label.innerText = text;
    }

    public get type(): U {
        return this._field.type as U;
    }

    public get value(): T | null {
        const val = this._field.value;
        if (!val) {
            return null;
        }
        return val as T;
    }

    public set value(val: T | null) {
        if (!val) {
            this._field.value = "";
        } else {
            this._field.value = String(val);
        }
    }

    public get id(): string {
        return this._field.id;
    }
    public set id(id: string) {
        if (id) {
            setUniqueID(this._field, id);
        } else {
            this._field.id = "";
        }
    }

    public get onchange() {
        return this._field.onchange;
    }
    public set onchange(action: ((ev: Event) => any) | null) {
        this._field.onchange = action;
    }

}
