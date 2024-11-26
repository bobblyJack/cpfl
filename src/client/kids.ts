// WIP: everything here basically.
export class MatterChild {
    gnames?: string;
    fname?: string;
    dob?: Date;
    gender?: Gender;
    constructor(gnames?: string, fname?: string, dob?: Date, gender?: Gender) {
        this.gnames = gnames;
        this.fname = fname;
        this.dob = dob;
        this.gender = gender;
    }
}