import CPFL from "..";
import { DriveItem } from "../graph";
import { ContactAddresses } from "./address";
import { ContactName } from "./names";

/**
 * generic contact
 */
export class ContactItem implements ContactCard {

    protected static readonly cache: GraphCache = "contacts";
    protected static readonly type: ContactType;

    public static async create(fileLabel: string): Promise<ContactItem>
    public static async create(fileContact: ContactCard): Promise<ContactItem>
    public static async create(input: string | ContactCard): Promise<ContactItem> {
        if (typeof input === 'string') {
            const fileLabel = input;
            if (!this.type) {
                console.log('creating typeless contact');
            }
            const item = await DriveItem.create(`${fileLabel}.json`, this.cache);
            const contact = new this(item.id, {type: this.type});
            item.saveContent(contact);
            return contact;
        }
        let fileLabel: string = input.name ? `${input.name.family}_${input.name.given}` : 'NewContactFile';
        if (!input.name) {
            console.log('creating default filelabel');
        }
        fileLabel += ".json";
        const item = await DriveItem.create(fileLabel, this.cache);
        let contact: ContactItem;
        switch (input.type) {
            case "party": contact = new ContactParty(item.id, input); break;
            case "lawyer": contact = new ContactLawyer(item.id, input); break;
            case "counsel": contact = new ContactCounsel(item.id, input); break;
        }
        item.saveContent(contact);
        return contact;
    }

    public static async open<T extends ContactItem>(fileID: string): Promise<T> {
        const item = await DriveItem.get(this.cache, fileID);
        return item.parseContent();
    }

    public readonly id: string; // driveitem id key
    public readonly type: ContactType;
    public name: ContactName;
    public address: ContactAddresses;
    public email: string;
    public phones: string[] = [];
    public gender?: Gender;
    
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

}


/**
 * party contact
 */
export class ContactParty extends ContactItem {
    public static readonly type: ContactType = "party";

    public dob?: Date;
    public occupation?: string;
    public constructor(id: string, base: ContactCard) {
        super(id, base);
        this.dob = base.dob;
        this.occupation = base.occupation;
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


/**
 * lawyer contact
 * @tbd map of firms
 * @tbd lcodes
 */
export class ContactLawyer extends ContactItem {
    public static readonly type: ContactType = "lawyer";

    public get firm(): string {
        return this.business;
    }
}

/**
 * counsel contact
 * @tbd map of chambers
 */
export class ContactCounsel extends ContactItem {
    public static readonly type: ContactType = "counsel";

    public get chambers(): string {
        return this.business;
    }
}