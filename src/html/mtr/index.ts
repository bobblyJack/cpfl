import { PageHTML } from "..";
import { ActiveMatter } from "./matter";

export class MtrPage extends PageHTML {
    
    private _matter?: Promise<ActiveMatter>;

    //private _createButton: HTMLButtonElement;
    //private _loadButton: HTMLButtonElement;
    private _importButton: HTMLButtonElement;

    constructor() {
        super("mtr", "Active Matter", "credentials");
        this.nav.flag(); // warn until matter is set

        this._importButton = document.createElement("button");
        this._importButton.textContent = "Import Matter";
        this._importButton.onclick = () => {
            this.matter = ActiveMatter.import();
        }
    }

    public get matter(): Promise<ActiveMatter> {
        if (!this._matter) {
            throw new Error('need to set a matter first duh');
        }
        return this._matter;
    }

    public set matter(file: Promise<ActiveMatter>) {
        this._matter = file.then(matter => {
            this._matter = Promise.resolve(matter);
            console.log('active matter set', matter);
            this.nav.unflag();
            return matter;
        });
    }

    public async open() {
        PageHTML.title.textContent = this.title;
        PageHTML.main.appendChild(this._importButton);
        return super.open();
    }
    public async close() {
        PageHTML.main.removeChild(this._importButton);
        return super.close();
    }
}