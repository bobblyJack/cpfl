export class MatterChild {
    gname: string;
    fname: string;
    dob?: Date;
    gender?: Gender;
    constructor(gname: string, fname: string, dob?: Date, gender?: Gender) {
        this.gname = gname;
        this.fname = fname;
        this.dob = dob;
        this.gender = gender;
    }
}