import { HTMLFieldElement } from "./base";

export class NumberField extends HTMLFieldElement<number, FieldInputTypeNumber> {
    protected _field!: HTMLInputElement;
    public constructor(data: FieldData<number>, type: FieldInputTypeNumber = "number") {
        super(type, data);
        this.value = data.value;
    }

    public get min(): number {
        return Number(this._field.min);
    }
    public set min(min: number) {
        this._field.min = String(min);
    }

    public get max(): number {
        return Number(this._field.max);
    }
    public set max(max: number) {
        this._field.min = String(max);
    }

    public get step(): number {
        return Number(this._field.step);
    }
    public set step(step: number) {
        this._field.min = String(step);
    }
}