import { HTMLDropFieldElement } from "./options";

/**
 * string fields
 * @wip restricted types (tel, email, url, search)
 * @wip field length
 * @tbd multi-line text area
 */
export class StringField extends HTMLDropFieldElement<string, FieldInputTypeString> {
    protected _field!: HTMLInputElement;
    public constructor(data: FieldData<string>, type: FieldInputTypeString = "text") {
        super(type, data);
        this.value = data.value ?? "";
    }

    public get list(): HTMLDataListElement {
        if (!this._list) {
            this._list = document.createElement('datalist');
            this.id = `${this._field.name}-dropfield`;
            this._list.id = `${this.id}-list`;
            this._field.setAttribute('list', this._list.id);
            this._block.appendChild(this._list);
        }
        return this._list;
    }

    public get value(): string {
        return this._field.value;
    }
    public set value(text: string) {
        this._field.value = text;
    }

    public get placeholder(): string {
        return this._field.placeholder;
    }
    public set placeholder(ph: string) {
        this._field.placeholder = ph;
    }   
}