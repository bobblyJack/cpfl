// matter data
import { PageHTML } from "..";

export class ActiveMatter implements MatterData {

    public static get page(): PageHTML {
        return PageHTML.get('act');
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
            this.page.titleExt = "Active Matter";
            this.page.titleInt = "Select a Matter";
            this.page.hnav.classList.add("warn");
            this.page.main.replaceChildren(this.page.get('div', 'main-0'));
            this.page.fnav.replaceChildren(this.page.get('nav', 'footer-0'));
        } else {
                this._current = file;    
                this.page.titleExt = `${file.client.name.last_name} (${file.id})`;
                this.page.titleInt = "Active Matter";
                this.page.hnav.classList.remove("warn");
                let main1: HTMLElement;
                let footer1: HTMLDivElement;
            try {
                main1 = this.page.get('div', 'main-1');
                footer1 = this.page.get('nav', 'footer-1');
            } catch {
                main1 = this.page.set('div', 'main-1');
                main1.textContent = "placeholder matter label input needs to go here";
                footer1 = this.page.set('nav', 'footer-1');
                const exitButton = this.page.set<HTMLButtonElement>('button', 'close');
                exitButton.textContent = "Close Current Matter";
                exitButton.onclick = () => this.current = null;
                footer1.appendChild(exitButton);
            }
            this.page.main.replaceChildren(main1);
            this.page.fnav.replaceChildren(footer1);
            
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

    public constructor( // WIP deal with json file here maybe?
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