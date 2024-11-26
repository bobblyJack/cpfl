import { AuthUser } from "../auth";
import { ParticipantRole } from "./roles";
import { MatterChild } from "./kids";

type ParticipantTypeMap = Map<ParticipantType, ParticipantSideMap>;
type ParticipantSideMap = Map<number, ParticipantRoleMap>;
type ParticipantRoleMap = Map<number, ParticipantRole>;

/**
 * matter data
 */
export class ActiveMatter {

    private static _current: ActiveMatter | null = null;
    public static get current(): ActiveMatter { // current active matter
        if (!this._current) {
            throw new Error('no active matter');
        }
        return this._current;
    }
    public static set current(matter: ActiveMatter | null) { // WIP: matter navigation
        this._current = matter;
    }

    private static _cloud: Promise<Map<string, string | ActiveMatter>>;
    private static get cloud() {
        if (!this._cloud) {
            this._cloud = initCloud().then(map => {
                this._cloud = Promise.resolve(map);
                return map;
            });
        }
        return this._cloud;

        async function initCloud(): Promise<Map<string, string>> { // fetch matters from cloud
            const user = AuthUser.current;
            const mattersPath = user.env.site.folders.matters;
            const rawFiles = await user.drive.collectPath(mattersPath);
            const map = new Map();
            for (const file of rawFiles) {
                map.set(file.name.replace(".json", ""), file.id);
            }
            return map;
        }
    }
    
    public static async save() {
        const cloudMatters = await this.cloud;
        const matter = ActiveMatter.current;
        const matterLabel = await matter.label;
        cloudMatters.set(matterLabel, matter);
        

        
    }

    public static async load(label: string) {
        const cloudMatters = await this.cloud;
        const val = cloudMatters.get(label);
        if (!val) {
            throw new Error(`matter ${label} cannot load`);
        }
        if (val instanceof ActiveMatter) {
            return val;
        }
        const user = AuthUser.current;
        const content = await user.drive.content(val, "json") as ActiveMatter;
        cloudMatters.delete(label);
        const matterLabel = await content.label;
        cloudMatters.set(matterLabel, content);
        ActiveMatter.current = content;
        return content;
    }

    public readonly key: string; // matter key / actionstep id
    public respondent: boolean = false; // our client = respondent switch
    public history: RelationshipHistory = {};
    public kids: MatterChild[] = [];
    public constructor(id: number | string, cname: string, lname: string) {
        this.key = String(id);
        const client = ParticipantRole.set(this, "party");
        client.fname = cname;
        const lawyer = ParticipantRole.set(this, "lawyer");
        lawyer.fname = lname; // TBD: add tenant solicitor enum
    }

    /**
     * nested participant maps
     */
    private index: ParticipantTypeMap = new Map();
    public get<T extends ParticipantRole>( // participant search function
        type: ParticipantType, 
        side: number = 1, // default our side
        id: number = 0 // default main participant of type/side
    ): T {
        const sides = this.index.get(type);
        if (sides) {
            const roles = sides.get(side);
            if (roles) {
                const role = roles.get(id);
                if (role) {
                    return role as T;
                }
            }
        }
        console.error(this.index, type, side, id); // TBD: debug.err
        throw new Error(`undefined participant`);
    }
    public set(role: ParticipantRole): ParticipantRole {
        let sides = this.index.get(role.type);
        if (!sides) {
            sides = new Map();
            this.index.set(role.type, sides);
        }
        let roles = sides.get(role.side);
        if (!roles) {
            roles = new Map();
            sides.set(role.side, roles);
        }
        for (let i = role.id;; i++) {
            if (!roles.has(i)) {
                role.id = i;
                roles.set(i, role);
                return role;
            }
        }
    }

    private _label?: Promise<string>; // file label
    public get label(): Promise<string> {
        if (!this._label) {
            const fname = this.get("party").fname;
            this._label = Promise.resolve(`${fname} (${this.key})`);
        }
        return this._label;
    }
    public set label(text: string) {
        this.label.then((label) => {
            if (text !== label) {
                this._label = ActiveMatter.cloud.then((map) => {
                    map.delete(label);
                    this._label = Promise.resolve(text);
                    map.set(label, this);
                    return label;
                });
            }
        });
    }

}