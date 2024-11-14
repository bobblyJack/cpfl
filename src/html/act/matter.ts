// matter data
import { PageHTML } from "..";
import { importActionstepMatter } from "./import";

export class ActiveMatter implements MatterData {

    private static _page: PageHTML;
    public static get page(): PageHTML {
        if (!this._page) {
            this._page = PageHTML.get('act');
        }
        return this._page;
    }

    public static get main(): HTMLElement {
        if (!this.page.content) {
            this.page.content = document.createElement('div');
            this.page.content.id = "act-cont";
        }
        return this.page.content;
    }

    private static _label: HTMLElement;
    public static get label(): HTMLElement {
        if (!this._label) {
            let label = document.getElementById('act-cont-label');
            if (!label) {
                label = document.createElement('div');
                label.id = "act-cont-label";
                this.main.prepend(label);
            }
            this._label = label;
        }
        return this._label;
    }

    public static get footer(): HTMLElement {
        if (!this.page.tray) {
            this.page.tray = document.createElement('div');
            this.page.tray.id = "act-tray";
        }
        return this.page.tray;
    }

    private static _current: Promise<ActiveMatter> | null = null;
    public static get current(): Promise<ActiveMatter> {
        if (!this._current) {
            throw new Error('no matter open');
        }
        return this._current;
    }
    public static set current(file: Promise<ActiveMatter> | null) {
        try {
            if (!file) {
                this._current = null;
                this.page.title = "Active Matter";
                this.label.textContent = "Select a Matter";
                this.page.nav.flag("warn");
            } else {
                this._current = file.then((current) => {
                    this._current = Promise.resolve(current);
                    const filename = current.client.name.last_name;
                    const matterLabel = `${filename} (${current.id})`;
                    this.page.title = matterLabel;
                    this.label.textContent = `Current Matter: ${matterLabel}`;
                    this.page.nav.unflag();
                    return current;
                });
            }
        } catch (err) {
            console.error('error setting active matter', err);
        }  
    }

    public static async import() { // get initial data from current word doc
        this.current = importActionstepMatter();
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