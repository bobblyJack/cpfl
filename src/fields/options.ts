import { HTMLFieldElement } from "./base";

export abstract class HTMLDropFieldElement<T extends string, U extends FieldInputType> extends HTMLFieldElement<T, U> {

    public constructor(type: U, data: FieldData<T>) {
        super(type, data);
    }

    protected _list?: HTMLDataListElement | HTMLSelectElement;
    public get list(): HTMLDataListElement | HTMLSelectElement {
        if (!this._list) {
            throw new Error('list undefined');
        }
        return this._list;
    }

    public createOption(value: T, label: string = value) {
        const element = document.createElement('option');
        element.value = value;
        element.textContent = label;
        this.list.appendChild(element);
        return element;
    }

    public groupOptions(label: string, options: HTMLOptionElement[] = []) {
        const element = document.createElement('optgroup');
        element.label = label;
        options.map(option => element.appendChild(option));
        this.list.appendChild(element);
        return element;
    }

}