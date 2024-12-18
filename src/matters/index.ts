import CPFL from "..";
import actionstep from "./actionstep";
import { AppContact } from "../contacts";
import { MatterObject } from "./base";
import { MatterChild } from "./kids";
import { POV } from "./sides";


export class AppMatter implements MatterCard {

    public static get page() {
        const page = CPFL.app.html('act');
        if (!page) {
            throw new Error('matter page undefined');
        }
        return page;
    }

    public static async list() {
        return MatterObject.list();
    }

    private static _current: AppMatter | null = null;
    public static get current(): AppMatter | null {
        return this._current;
    }
    public static set current(matter: AppMatter | null) { // WIP matter nav
        this._current?.save();
        if (matter !== this._current) {
            try {
                const nullSub = this.page.get('act_null');

                if (matter && !this._current) { // open matter
                    this.page.fnav.removeAttribute('hidden');
                    this.page.nav.unflag();
                    nullSub.hide();
                    const actSub = this.page.get('act_us');
                    actSub.render();

                } else if (!matter && this._current) { // close matter
                    this.page.nav.flag();
                    nullSub.render();
                }

            } catch (err) {
                console.error('error changing active matter', err);
            } finally {
                this._current = matter;
            }
        }
    }

    /**
     * create new matter
     */
    static async create(client: ContactCard) {
        const obj: MatterObject = await MatterObject.create(client.name);
        const matter = new this(obj.id, client);
        this.current = matter;
        return this.current;
    }

    /**
     * open existing matter
     */
    static async open(fileID: string) {
        const obj = await MatterObject.get(fileID) as MatterObject;
        const base = await obj.load();
        const matter = new this(obj.id, base);
        this.current = matter;
        return this.current;
    }

    /**
     * import matter from actionstep
     */
    static async import() {
        this.current = await actionstep();
        return this.current;
    }

    public readonly id: string; // graphitem id
    public asref?: number; // actionstep id
    public participants: ParticipantRoles = {};
    public children: MatterChild[] = [];
    public relationship: RelationshipHistory = {};
    public respondent?: boolean;
    protected constructor(id: string, base: MatterCard | ContactCard) {
        this.id = id;
        if ('participants' in base) { // matter card base
            this.asref = base.asref;
            this.respondent = base.respondent;
            this.relationship = base.relationship;
            this.participants = base.participants;
            for (const child of base.children) {
                this.children.push(new MatterChild(id, child));
            }
        } else { // contact card base (client)
            this.addRole(1, base, true);
        }
    }

    protected async _base() {
        return MatterObject.get(this.id) as Promise<MatterObject>;
    }

    public async save() {
        const obj = await this._base();
        obj.save(this);
    }

    public async getRole(id: string): Promise<AppContact>;
    public async getRole(side: POV | number, type: ContactType, id?: number): Promise<AppContact>;
    public async getRole(p1: string | number, type?: ContactType, p2: number = 0) {
        let id: string;
        if (typeof p1 === 'string') {
            id = p1;
        } else {
            if (!type) {
                throw new Error('invalid param type');
            }
            const roles = this.getRoles(p1, type);
            id = roles[p2];
        }
        return AppContact.get(id);
    }

    public getRoles(side: POV | number, type: ContactType): string[] {
        let roles = this.participants[side];
        if (!roles) {
            this.participants[side] = new Map<ContactType, string[]>();
            return this.getRoles(side, type);
        }
        let role = roles.get(type);
        if (!role) {
            role = [];
            roles.set(type, role);
        }
        return role;
    }

    public async addRole(side: POV | number, contact: ContactCard, primary?: boolean): Promise<void>;
    public async addRole(side: POV | number, type: ContactType, id: string, primary?: boolean): Promise<void>;
    public async addRole(side: POV | number, type: ContactType, name: Name, primary?: boolean): Promise<void>;
    public async addRole(
        side: POV | number, 
        p1: ContactType | ContactCard, 
        p2: string | Name | boolean = false, 
        p3?: boolean
    ) {
        try {
            const type: ContactType = typeof p1 === 'string' ? p1 : p1.type;
            const roles = this.getRoles(side, type);
            let id: string;
            if (typeof p2 === 'string') {
                id = p2;
            } else {
                let base: Name | ContactCard;
                if (typeof p1 !== 'string') {
                    base = p1;
                } else if (typeof p2 !== 'boolean') {
                    base = p2;
                } else {
                    throw new Error('invalid param type');
                }
                const obj = await AppContact.set(type, base);
                id = obj.id;
            }
            const filtered = roles.filter(exists => exists !== id);
            const primary: boolean = typeof p2 === 'boolean' ? p2 : (p3 ?? false);
            if (primary) {
                this.participants[side].set(type, [id].concat(filtered));
            } else {
                this.participants[side].set(type, filtered.concat([id]));
            } 
            console.log('contact added');
        } catch (err) {
            console.error('error adding contact', err);
        }
    }

    public addChild(base: ChildCard) {
        for (const child of this.children) {
            if (child.name.given === base.name.given) {
                console.log('child already present');
                return;
            }
        }
        this.children.push(new MatterChild(this.id, base));
    }

}