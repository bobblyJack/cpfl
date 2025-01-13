import { HTMLFieldElement } from "./base";

export class DateField extends HTMLFieldElement<Date> {
    protected _field!: HTMLInputElement;
    public constructor(data: FieldData<Date>) {
        super(data);
    }
}

// age
// date parsing
