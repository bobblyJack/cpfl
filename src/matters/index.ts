import CPFL from "..";
import actionstep from "./actionstep";
import { DriveItem } from "../graph";
import { MatterChild } from "./kids";
import { MatterParticipant } from "./roles";
import { POV } from "./sides";
import { 
    ContactCounsel, 
    ContactItem, 
    ContactLawyer, 
    ContactParty 
} from "../contacts";


export class MatterItem implements MatterCard {
    static readonly cache: GraphCache = "matters";

    public static get page() {
        const page = CPFL.app.html('act');
        if (!page) {
            throw new Error('matter page undefined');
        }
        return page;
    }

    public static async list() {
        return DriveItem.cache(this.cache);
    }

    private static _current: MatterItem | null = null;
    public static get current(): MatterItem | null {
        return this._current;
    }
    public static set current(matter: MatterItem | null) { // WIP matter nav
        if (matter !== this._current) {

            try {
                const nullSub = this.page.get('act_null');
                if (matter && !this._current) {
                    nullSub.main.hidden = true;
                    for (const foot of this.page.feet) {
                        
                    }
                } else if (this._current && !matter) {
                    nullSub.main.removeAttribute('hidden');
                }

                if (this._current) {
                    this._current.save();
                }

            } catch (err) {

            } finally {
                this._current = matter;
            }

            
        }
    }

    static async create(fileName: string) {
        const item = await DriveItem.create(`${fileName}.json`, this.cache);
        const matter = new this(item.id);
        item.saveContent(matter);
        this.current = matter;
        return this.current;
    }

    static async open(fileID: string) {
        const item = await DriveItem.get(this.cache, fileID);
        this.current = await item.parseContent<MatterItem>();
        return this.current;
    }

    /** import from actionstep */
    static async import() {
        this.current = await actionstep();
        return this.current;
    }

    readonly id: string;
    asref?: number;
    readonly participants: Map<ParticipantReferenceKey, MatterParticipant[]>;
    relationship: RelationshipHistory;
    readonly children: Map<string, MatterChild>;
    respondent?: boolean;
    protected constructor(id: string, base?: MatterCard) {
        this.id = id;
        this.asref = base?.asref;
        this.respondent = base?.respondent;
        this.relationship = base?.relationship ?? {};
        this.participants = new Map();
        this.children = new Map();
        if (base) {
            for (const [key, val] of Array.from(base.participants.entries())) {
                const array = []
                for (const participant of val) {
                    array.push(new MatterParticipant(participant));
                }
                this.participants.set(key, array);
            }
            for (const child of Array.from(base.children.values())) {
                const kid = new MatterChild(child);
                this.children.set(kid.name.given, kid);
            }
        }
    }

    private saveTimer: NodeJS.Timeout | null = null;
    public async save() {
        if (!this.saveTimer) {
            this.saveTimer = setTimeout(async () => {
                CPFL.app.debug.log('saving matter', this);
                const item = await DriveItem.get(MatterItem.cache, this.id);
                item.saveContent(this);
            }, 10000);
        }
    }

    public async addParticipant(side: POV | number, type: ContactType, contact: string | ContactCard) {
        const key: ParticipantReferenceKey = `${side}_${type}`;
        const array = this.participants.get(key) ?? [];
        let item: ContactItem;
        if (typeof contact === 'string') {
            item = await ContactItem.open(contact);
        } else {
            item = await ContactItem.create(contact);
        }
        array.push(new MatterParticipant({id: item.id, side, type}));
        this.participants.set(key, array);
    }

    public async getParticipant<T extends ContactItem>(side: POV | number, type: ContactType) {
        const participants = this.participants.get(`${side}_${type}`);
        if (!participants || !participants.length) {
            return []
        } else if (participants.length === 1) {
            return participants[0].openContact<T>();
        } else {
            return Promise.all(participants.map((participant) => participant.openContact<T>()));
        }
    }

    public get client() {
        return this.getParticipant<ContactParty>(1, "party").then((clients => {
            if (Array.isArray(clients)) {
                if (!clients.length) {
                    throw new Error('primary client unmapped');
                }
                return clients[0];
            }
            return clients;
        }));
    }

    public get lawyer() {
        return this.getParticipant<ContactLawyer>(1, "lawyer").then((lawyers => {
            if (Array.isArray(lawyers)) {
                if (!lawyers.length) {
                    throw new Error('assigned lawyer unmapped');
                }
                return lawyers[0];
            }
            return lawyers;
        }));
    }

    public get counsel() {
        return this.getParticipant<ContactCounsel>(1, "counsel").then((counsel => {
            if (Array.isArray(counsel)) {
                if (!counsel.length) {
                    throw new Error('counsel unmapped');
                }
                return counsel[0];
            }
            return counsel;
        }));
    }

}