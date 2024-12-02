import CPFL from "..";
import { GraphItem } from "../graph/archive/items";
import { ParticipantRole } from "./roles";
import { MatterChild } from "./kids";





/**
 * matter data
 */
export class ActiveMatter implements MatterFile {

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

    private static index: Map<string, string | ActiveMatter> = new Map();
    private static root: GraphItem;
    public static async init() {
        if (!this.root) {
            this.root = await GraphItem.branch("matters");
        }
        if (this.root.folder) {
            const files = await this.root.folder.children;
            for (const file of files) {
                this.index.set(file.id, file.name);
            }
        }
    }

    public static async load(key: string) {
        const val = this.index.get(key);
        if (!val) {
            throw new Error(`matter unmapped`);
        }
        if (val instanceof ActiveMatter) {
            return val;
        }
        const item = GraphItem.get(key);
        if (!item.file) {
            throw new Error(`matter invalid`);
        }
        const download = await item.file.download();
        const json = await download.json()
        const user = AuthUser.current;
        const content = await user.drive.content(val, "json") as ActiveMatter;
        cloudMatters.delete(label);
        const matterLabel = await content.label;
        cloudMatters.set(matterLabel, content);
        ActiveMatter.current = content;
        return content;
    }



    
    
    

    

    public readonly key: string; // matter key / actionstep id
    public readonly item: string; // drive item id
    public respondent: boolean = false; // our client = respondent switch
    public history: RelationshipHistory = {};
    public kids: MatterChild[] = [];
    public constructor(init: string | MatterFile) {
        if (typeof init === 'string') {
            this.key = init; // TBD: generate a fresh key for non-actionstep matters
            this.item = ""; // TBD: initial save to cloud that creates the json and maps its id here
        } else {
            this.key = init.key; // TBD: the whole fucking interface tbh
            this.item = init.item; // TBD: i literally had one for participants and now i need to remake yay.
        }
    }

    public async save() {
        const cloudMatters = await this.cloud;
        const matter = ActiveMatter.current;
        const matterLabel = await matter.label;
        cloudMatters.set(matterLabel, matter);
        

        
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