import { HTMLFieldElement } from "./base";

export class BooleanField extends HTMLFieldElement<boolean, FieldInputTypeBoolean> {
    protected _field!: HTMLInputElement;
    public constructor(data: FieldData<boolean>) {
        super("checkbox", data);
        this.value = !!data.value;
    }

    public get value(): boolean {
        return this._field.checked;
    }
    public set value(check: boolean) {
        this._field.checked = check;
    }

}

