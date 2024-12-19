import { DropField } from "../fields";

const genderOptions: Gender[] = ["M", "F", "X"]

export default function createGenderSelect(def?: Gender) {
    const select = new DropField('Gender');
    const blankOption = select.create(["", "..."]);
    blankOption.disabled = true;
    blankOption.selected = true;
    select.add(blankOption);
    for (const gender of genderOptions) {
        const e = select.create([gender], true);
        select.add(e);
    }
    if (def) {
        select.value = def;
    }
    return select;
}