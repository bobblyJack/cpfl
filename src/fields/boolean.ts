import { HTMLFieldElement } from "./base";

export class BooleanField extends HTMLFieldElement<boolean> {
    protected _field!: HTMLInputElement;
    public constructor(data: FieldData<boolean>) {
        super(data);

    }


}

// checked