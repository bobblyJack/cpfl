// matter data
import { PageHTML } from "..";
import { importActionstepMatter } from "./import";

export class ActiveMatter implements MatterData {

    private static _current: Promise<ActiveMatter> | null = null;
    public static get current(): Promise<ActiveMatter> {
        if (!this._current) {
            throw new Error('no matter open');
        }
        return this._current;
    }
    public static set current(file: Promise<ActiveMatter> | null) {
        try {
            const act = PageHTML.get('act');
            if (!file) {
                this._current = null;
                act.title = "Select a Matter";
                act.nav.flag("warn");
            } else {
                this._current = file.then((current) => {
                    this._current = Promise.resolve(current);
                    const filename = current.client.name.last_name;
                    act.title = `${filename} (${current.id})`;
                    act.nav.unflag();
                    
                    return current;
                });
            }
        } catch (err) {
            console.error('error setting active matter', err);
        }  
    }

    public static async import() { // get initial data from current word doc
        const data = await importActionstepMatter();
        const file = new ActiveMatter(data.id, data.client, data.lawyer);
        file.counsel = data.counsel;
        file.appID = data.appID;
        file.resID = data.resID;
        file.op = data.op;
        file.ol = data.ol;
        file.oc = data.oc;
        file.relationship = data.relationship;
        file.children = data.children;
        return file;
    }

    readonly id: number; // actionstep id
    appID?: number; // applicant id
    resID?: number; // respondent id

    client: PartyData; // our client
    lawyer: LawyerData; // solicitor
    counsel?: CounselData; // barrister

    op?: PartyData; // other party
    ol?: LawyerData; // other party's lawyer
    oc?: CounselData; // other party's counsel

    relationship: RelationshipData = {};
    children: ChildData[] = [];

    public constructor( // WIP deal with json file here probably?
        id: number, 
        client?: Partial<PartyData>, 
        lawyer?: Partial<LawyerData>
    ) {
        this.id = id;
        this.client = {
            id: 0,
            name: {
                first_name: "",
                last_name: "",
            },
            email: "",
            phone: [],
            main_address: {
                address_line_1: "",
                city: "",
                state_province: "",
                postcode: ""
            },
            ...client
        }
        this.lawyer = {
            id: 0,
            name: {
                first_name: "",
                last_name: ""
            },
            email: "",
            phone: [],
            main_address: {
                address_line_1: "",
                city: "",
                state_province: "",
                postcode: ""
            },
            ...lawyer
        }
    }

}