import { AppMatter } from ".";
import { calcAge } from "../contacts";
import { ContactName } from "../contacts/names";

export class MatterChild implements ChildCard {
    name: ContactName;
    dob?: Date | undefined;
    gender?: Gender | undefined;
    constructor(
        public readonly id: string, // matter id
        base: ChildCard
    ) {
        this.name = new ContactName(base.name);
        this.dob = base.dob;
        this.gender = base.gender;
    }

    openMatter() {
        return AppMatter.open(this.id);
    }

    get age(): number {
        if (!this.dob) {
            throw new Error('undefined date');
        }
        return calcAge(this.dob);
    }
}