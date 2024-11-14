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
            this.label;
        }
        return this.page.content;
    }

    public static get footer(): HTMLElement {
        if (!this.page.tray) {
            this.page.tray = document.createElement('div');
            this.page.tray.id = "act-tray";
            this.testButton;
        }
        return this.page.tray;
    }

    private static _current: ActiveMatter | null = null;
    public static get current(): ActiveMatter {
        if (!this._current) {
            throw new Error('no matter open');
        }
        return this._current;
    }
    public static set current(file: ActiveMatter | null) {
        if (!file) {
            this._current = null;
            this.page.title = "Active Matter";
            this.label.textContent = "Select a Matter";
            this.page.nav.flag("warn");
            this.newButton.hidden = false;
            this.importButton.hidden = false;
            this.closeButton.hidden = true;
        } else {
            this._current = file;    
            const filename = file.client.name.last_name;
            const matterLabel = `${filename} (${file.id})`;
            this.page.title = matterLabel;
            this.label.textContent = `Current Matter: ${matterLabel}`;
            this.page.nav.unflag();
            this.newButton.hidden = true;
            this.importButton.hidden = true;
            this.closeButton.hidden = false;
        }
    }

    private static _label: HTMLElement;
    public static get label(): HTMLElement {
        if (!this._label) {
            let label = document.getElementById('act-cont-label');
            if (!label) {
                label = document.createElement('div');
                label.id = "act-cont-label";
            }
            this._label = label;
        }
        return this._label;
    }
    
    private static _newButton: HTMLButtonElement;
    public static get newButton() {
        if (!this._newButton) {
            this._newButton = document.createElement('button');
            this._newButton.id = "act-button-new";
            this._newButton.textContent = "Create Matter";
            this._newButton.onclick = () => {
                console.log('testing')
            }
            this.main.appendChild(this._newButton);
        }
        return this._newButton;
    }

    public static async import() {
        try {
            const matter = await importActionstepMatter();
            this.current = matter;
        } catch (err) {
            console.error(err); // WIP - turn this whole bit into a toast notification.
            const origMsg = this.label.textContent;
            this.label.textContent = "you need to have the right import precedent up to do that";
            setTimeout(() => {
                this.label.textContent = origMsg;
            }, 2000);
        }
    }

    private static _closeButton: HTMLButtonElement;
    public static get closeButton() {
        if (!this._closeButton) {
            const button = document.createElement('button');
            button.id = "act-button-close";
            button.textContent = "Close Matter";
            button.onclick = () => {
                this.current = null;
            }
            this.main.appendChild(button);
            this._closeButton = button;
        }
        return this._closeButton;
    }

    public static async printTest() {
        try {
            const matter = ActiveMatter.current;
            Word.run(async (context) => {
                for (const p of Object.entries(matter)) {
                    context.document.body.insertParagraph(`${p[0]}: ${JSON.stringify(p[1])}`, "End");
                }
            });
        } catch (err) {
            console.error(err);
        }
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