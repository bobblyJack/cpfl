import { PageHTML } from "..";
import { ActiveMatter } from "./matter";

export class MtrPage extends PageHTML {
    private _matter?: ActiveMatter; 
    constructor() {
        super("mtr", "Active Matter", "credentials");
    }

    public async openMatter(input?: number): Promise<ActiveMatter> {
        try {
            if (!input) {
                return ActiveMatter.import();
            }
            try {
                return ActiveMatter.load(input);
            } catch {
                return new ActiveMatter(input);
            }
        } catch (err) {
            console.error('matter cannot be created for some reason');
            throw err;
        }
    }

    public async closeMatter() {
        // save to cloud
        this._matter = undefined;
    }

    public async open() {
        PageHTML.title.textContent = this.title;
        return super.open();
    }
    public async close() {
        return super.close();
    }
}