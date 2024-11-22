import { PageHTML } from "..";
import { MatterParticipant } from "./party";
import { ParticipantLink } from "./enum";
import { MatterChild } from "./kids";

/**
 * matter data
 */
export class ActiveMatter {

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

        if (!file) { // close matter
            this._current = null;
            this.page.titleExt = "Active Matter";
            this.page.titleInt = "Select a Matter";
            this.page.hnav.classList.add("warn");
            this.page.main.replaceChildren(this.page.get('div', 'main-0'));
            this.page.fnav.replaceChildren(this.page.get('nav', 'footer-0'));


        } else { // open matter
            this._current = file;    
            this.page.titleExt = `${file.label}`;
            this.page.titleInt = "Active Matter";
            this.page.hnav.classList.remove("warn");
            const main = this.page.get('div', `main-${file.id}`);
            const footer = this.page.get('nav', `footer-${file.id}`);
            footer.appendChild(this.page.get('button', 'close'));
            this.page.main.replaceChildren(main);
            this.page.fnav.replaceChildren(footer);
        }
    }

    public readonly id: number; // matter key / actionstep id
    public respondent: boolean = false; // our client = respondent switch
    public relationship: RelationshipData = {};
    public kids: MatterChild[] = [];
    public constructor(id: number) {
        this.id = id;
        
        const main = ActiveMatter.page.set('div', `main-${this.id}`);
        main.textContent = "put some shit here idk"; // wip
        const input = ActiveMatter.page.set<HTMLInputElement>('input', `main-${this.id}`);
        input.type = "text";
        input.placeholder = this.lawyer.email || "our email";
        input.oninput = () => {
            this.lawyer.email = input.value;
        }
        
        main.appendChild(input);

        const footer = ActiveMatter.page.set('nav', `footer-${this.id}`);

        const button = document.createElement('button'); // debug: print test
        button.textContent = "Print Test";
        button.onclick = () => this.printTest();
        footer.appendChild(button);
        
    }

    private parties: Map<ParticipantLink, MatterParticipant> = new Map(); // parties map
    public party(key: ParticipantLink) {
        let p = this.parties.get(key);
        if (!p) {
            p = MatterParticipant.create(key);
            this.parties.set(key, p);
        }
        return p;
    }

    // aliases (our side)
    public get client() {
        return this.party(ParticipantLink.rp);
    }
    public get lawyer() {
        return this.party(ParticipantLink.rl);
    }
    public get counsel() {
        return this.party(ParticipantLink.rc);
    }

    get label(): string { // file label
        if (this.client.fname) {
            return `${this.client.fname} (${this.id})`;
        }
        return `Matter ${this.id}`;
    }

    printTest() {
        if (ActiveMatter.page.app.mode === 'taskpane' && Office.context.host === Office.HostType.Word) {
            console.log('word print test', this);
            
                Word.run(async (context) => {
                    console.log(this.parties);
                    for (const p of Array.from(this.parties.values())) {
                        const text = JSON.stringify(p);
                        console.log(text);
                        context.document.body.insertParagraph(text, "End");
                    }
                    await context.sync();
                });
            
        } else {
            console.log('non-word print test', this);
        }
    }

}