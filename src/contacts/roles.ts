import { DriveItem } from "../graph/archive";

/**
 * contact file or folder
 * @tbd index of firms/chambers
 * @tbd lcodes
 */
export class ContactItem extends DriveItem implements ContactCard {

    protected static readonly cache: GraphCache = "contacts";

    public type: ContactType;
    public gnames: string; // TBD: name interface
    public fname: string;
    public email: string; // TBD: email verification
    public gender: Gender;
    public dob: Date;
    public occupation: string;
    public phones: string[]; // TBD: better phone number handling
    public mainAdd: StreetAddress;
    public postAdd: StreetAddress | null;

    protected constructor(item: DriveItem, content: ContactCard) {
        super(item);
        this.type = content.type;
        this.gnames = content.gnames;
        this.fname = content.fname;
        this.email = content.email;
        this.gender = content.gender;
        this.dob = content.dob;
        this.occupation = content.occupation;
        this.phones = content.phones;
        this.mainAdd = content.mainAdd;
        this.postAdd = content.postAdd;
    }

    public get initials(): string {
        let initials = "";
        const names = this.gnames.split(" ").concat(this.fname.split(" "));
        for (const name of names) {
            initials += name.slice(0,1);
        }
        return initials.toUpperCase();
    }

    public get age(): number {
        if (!this.dob) { // TBD: better error handling here
            throw new Error('age calculation requires dob')
        }
        const today = new Date();
        let age = today.getFullYear() - this.dob.getFullYear();
        const months = today.getMonth() - this.dob.getMonth();
        if (months === 0) {
            if (today.getDate() < this.dob.getDate()) {
                age--;
            }
        } else if (months < 0) {
            age--;
        }
        return age;
    }

}