import { HTMLFieldElement } from "./base";

export class NumberField extends HTMLFieldElement<number> {
    protected _field!: HTMLInputElement;
    public constructor(data: FieldData<number>) {
        super(data);
    }
}

// min max