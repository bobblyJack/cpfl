import { SelectField } from "../fields"

export default function createGenderField(def: Gender | null = null) {
    return new SelectField<Gender>({
        name: 'gender',
        label: 'Gender',
        value: def,
        options: [["M"], ["F"], ["X"]]
    });
}