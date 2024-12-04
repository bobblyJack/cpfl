export class MatterChild implements ChildCard {
    name: Name;
    dob?: Date | undefined;
    gender?: Gender | undefined;
    constructor(base: ChildCard) {
        this.name = base.name;
        this.dob = base.dob;
        this.gender = base.gender;
    }
}