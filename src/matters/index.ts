import CPFL from "..";
import { ContactItem } from "../contacts";
import { DriveItem } from "../graph";
import { MatterChild } from "./kids";
import { MatterParticipant } from "./roles";
import { POV } from "./sides";

export class MatterItem implements MatterCard {
    static readonly cache: GraphCache = "matters";

    private static _current: MatterItem | null = null;
    public static get current(): MatterItem {
        if (!this._current) {
            throw new Error('no active matter');
        }
        return this._current;
    }
    public static set current(matter: MatterItem | null) { // WIP matter nav
        this._current = matter; 
    }

    static async create(fileName: string) {
        const item = await DriveItem.create(`${fileName}.json`, this.cache);
        const matter = new this(item.id);
        item.saveContent(matter);
        return matter;
    }

    static async open(fileID: string) {
        const item = await DriveItem.get(this.cache, fileID);
        return item.parseContent<MatterItem>();
    }

    readonly id: string;
    asref?: number;
    participants: Map<ParticipantReferenceKey, MatterParticipant[]>;
    relationship: RelationshipHistory;
    children: Map<string, MatterChild>;
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

}