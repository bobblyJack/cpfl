import { BirthDate } from "./birth";
import { ContactName } from "./names";

export class ContactChild implements ChildCard {
    name: ContactName;
    dob?: BirthDate | undefined;
    gender?: Gender | undefined;
    constructor(
        public readonly parents: string, // matter id
        base: ChildCard
    ) {
        this.name = new ContactName(base.name);
        this.gender = base.gender;
        if (base.dob) {
            this.dob = new BirthDate(base.dob);
        }
    }

}