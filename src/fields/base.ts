// consolidate same props / methods between field classes.

function mapInputTypes(type: HTMLInputType) { // define fields by their output type ? yes.
    // this function could actually be useful tbh.
    switch (type) {
        // boolean
        case "checkbox":
        case "radio": // this isn't really boolean it is a multi-select isn't it

        // date
        case "date":
        case "month":
        case "week":

        // text
        case "text":
        case "email":
        case "url":
        case "password":
        case "tel":
        case "search":

        // number
        case "number":
        case "range":

        // blob
        case "file":
    }

}

type FieldOutput = string | number | boolean | Date;

interface FieldData<T extends FieldOutput> {
    label: string;
    value: T;
}

class HTMLFieldElement<T extends FieldOutput> implements FieldData<T> {

    protected _block: HTMLLabelElement;
    protected _label: HTMLSpanElement;
    protected _break?: HTMLBRElement;
    protected _field: HTMLInputElement | HTMLSelectElement;
    protected _options: (HTMLOptionElement | HTMLInputElement)[] = []; // should i even use fucking radios

    public constructor(data: FieldData<T>) {
        this._block = document.createElement('label');

        this._label = document.createElement('span');
        this.label = data.label;

        this._field = document.createElement('input');


    }

    get block() {
        return this._block;
    }

    get label(): string {
        return this._label.innerText;
    }
    set label(text: string) {
        this._label.innerText = text;
    }

    get value() {
        return this._field.value as T;
    }
}

