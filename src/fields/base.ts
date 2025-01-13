import { setUniqueID } from "./id";

export abstract class HTMLFieldElement<T extends FieldOutputType> implements FieldData<T> {
    protected _block: HTMLLabelElement;
    protected _label: HTMLSpanElement;
    protected _field: HTMLInputElement | HTMLSelectElement;

    public constructor(data: FieldData<T>) {
        
        this._block = document.createElement('label');
        this._label = document.createElement('span');

        if (data.type.includes('select')) {
            this._field = document.createElement('select');
            if (data.type === 'select-multiple') {
                this._field.multiple = true;
            }
        } else {
            this._field = document.createElement('input');
            this._field.type = data.type;
        }
        
        this._label.innerText = data.label;
        this._field.name = data.name ? data.name : data.label.replace(/ /g, "");

        if (data.type === 'checkbox') {
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

    public get type(): FieldInputType {
        return this._field.type as FieldInputType;
    }

    public get value(): T | null {
        const val = this._field.value;
        if (!val) {
            return null;
        }
        return val as T;
    }

    public get id(): string {
        return this._field.id;
    }
    public set id(id: string) {
        setUniqueID(this._field, id);
    }

    public get onchange() {
        return this._field.onchange;
    }
    public set onchange(action: ((ev: Event) => any) | null) {
        this._field.onchange = action;
    }

}
