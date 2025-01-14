import { DateField } from "../fields";

export default function createDOBField(def: Date | null = null) {
    return new DateField({
        name: 'dob',
        label: 'Date of Birth',
        value: def
    });
}