import { ContactObject } from "./base";
import { ContactAddresses } from "./address";
import { ContactName } from "./names";

export class AppContact implements ContactCard {

    protected static index: Map<string, AppContact> = new Map();

    public static async get(id: string) {
        let contact = this.index.get(id);
        if (!contact) {
            const obj = await ContactObject.get(id) as ContactObject;
            const card = await obj.load();
            contact = new this(id, card);
        }
        return contact;
    }

    public static async set(type: ContactType, base: Name | ContactCard) {
        const name = isContactCard(base) ? base.name : base;
        base = isContactCard(base) ? base : {type, name}
        const obj = await ContactObject.create(type, name);
        let contact = this.index.get(obj.id);
        if (!contact) {
            contact = new this(obj.id, base);
        }
        return contact;
        function isContactCard(input: Name | ContactCard): input is ContactCard {
            return 'type' in input;
        }
    }

    public readonly id: string; // graphItem key
    public readonly asref?: number; // actionstep id
    public readonly type: ContactType;
    public name: ContactName;
    public address: ContactAddresses;
    public email: string;
    public phones: string[] = [];
    public gender?: Gender;
    public dob?: Date;
    public occupation?: string;
    
    
    protected constructor(id: string, base: ContactCard) {
        this.id = id;
        this.asref = base.asref;
        this.type = base.type;
        this.name = new ContactName(base.name);
        this.email = base.email || "";
        this.gender = base.gender;
        this.address = new ContactAddresses(base.address);
        for (const num in base.phones) {
            this.phones.push(num);
        }
        AppContact.index.set(id, this);
    }

    public async base() { // graphItem object
        return ContactObject.get(this.id) as Promise<ContactObject>;
    }

    protected get business(): string {
        return this.address.post.location.trim();
    }

    public get age(): number {
        if (!this.dob) { // TBD: better error handling here
            throw new Error('age calculation requires dob')
        }
        return calcAge(this.dob);
    }

}

export function calcAge(dob: Date) {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const months = today.getMonth() - dob.getMonth();
    if (months === 0) {
        if (today.getDate() < dob.getDate()) {
            age--;
        }
    } else if (months < 0) {
        age--;
    }
    return age;
}