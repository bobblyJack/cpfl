import { DateField, SelectField } from "../fields";
import { ContactName } from "./names";
import createGenderField from "./gender";
import createDOBField from "./dob";

export class ContactChild implements ChildCard {
    name: ContactName;
    dob: DateField;
    gender: SelectField<Gender>;
    constructor(
        public readonly parents: string, // matter id
        base: ChildCard
    ) {
        this.name = new ContactName(base.name);
        this.gender = createGenderField(base.gender.value);
        this.dob = createDOBField(base.dob.value);
    }
}