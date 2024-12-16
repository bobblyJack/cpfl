import CPFL from "..";
import { ContactObject } from "./base";
import { ContactAddresses } from "./address";
import { ContactName } from "./names";

/**
 * generic contact
 */
export class ContactItem implements ContactCard {

    public static async get(id: string) {
        const obj = await ContactObject.get(id);
        const card = await obj.load();
        return new this(id, card);
    }

    public static async set(type: ContactType, fileName: string) {

    }

    public readonly id: string; // driveitem id key
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
        this.type = base.type;
        this.name = new ContactName(base.name);
        this.email = base.email || "";
        this.gender = base.gender;
        this.address = new ContactAddresses(base.address);
        for (const num in base.phones) {
            this.phones.push(num);
        }
    }

    private saveTimer: NodeJS.Timeout | null = null;
    public async save() {
        if (!this.saveTimer) {
            this.saveTimer = setTimeout(async () => {
                CPFL.app.debug.log('saving contact', this);
                const item = await DriveItem.get(ContactItem.cache, this.id);
                item.saveContent(this);
            }, 10000);
        }
    }

    protected get business(): string {
        return this.address.post.location.trim();
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