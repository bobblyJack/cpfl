// dob element + age calculator in one (exportable) thing

import { InputField } from "../fields";

const dobMap: WeakMap<BirthDate, InputField> = new Map();

export class BirthDate extends Date {

    /**
     * construct birth date
     * @param year (19)XX or YYYY
     * @param month 1 (Jan) - 12 (Dec)
     * @param date 1 - 31
     */
    public constructor(year: number, month: number, date: number);
    /**
     * construct birth date
     * @param input "YYYY-MM-DD"
     */
    public constructor(input: string);
    public constructor(p1: string | number, p2?: number, p3?: number) {
        if (typeof p1 === 'string') {
            super(p1)
        } else {
            const year = p1;
            const monthIndex = (p2 ?? 1) - 1;
            const date = p3 ?? 1;
            super(year, monthIndex, date);
        }
    }

    public get age(): number {
        const today = new Date();
        let age = today.getFullYear() - this.getFullYear();
        const months = today.getMonth() - this.getMonth();
        if (months === 0) {
            if (today.getDate() < this.getDate()) {
                age--;
            }
        } else if (months < 0) {
            age--;
        }
        return age;
    }

    public get value(): string { // html input value
        return this.toISOString().split('T')[0];
    }

    public getField() {
        let field = dobMap.get(this);
        if (!field) {
            field = new InputField("Date of Birth", {
                inputType: "date",
                specifiedName: "dob"
            });
            field.value = this.value;
        }
        return field;

    }

}

class DOBInputField extends InputField {
    public get date(): BirthDate {
        
    }
}