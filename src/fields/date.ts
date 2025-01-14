import { HTMLFieldElement } from "./base";

export class DateField extends HTMLFieldElement<Date, FieldInputTypeDate> {
    protected _field!: HTMLInputElement;
    public constructor(data: FieldData<Date>, type: FieldInputTypeDate = "date") {
        super(type, data);
        this.value = data.value;
    }

    public get value(): Date | null {
        if (!this._field.value) {
            return null;
        }
        return new Date(this._field.value);
    }

    public set value(date: Date | null | string) {
        if (!date) {
            this._field.value = "";
        } else if (date instanceof Date) {
            this._field.value = date.toISOString().split('T')[0];
        } else {
            try {
                this.value = new Date(date);
            } catch {
                this.value = null;
            }
        }
    }

    public age(): number | undefined {
        const dob = this.value;
        if (!dob) {
            return undefined;
        }
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const months = today.getMonth() - dob.getMonth();
        if (months === 0) {
            if (today.getDate() < dob.getDate()) {
                age--;
            }
        } else if (months < 0) {
            age--;
        }
        return age;
    }
}