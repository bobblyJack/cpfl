import { PageHTML } from "..";

const hub = new PageHTML('hub', 'Dashboard', 'home');


export class HubPage extends PageHTML {
    private welcomeMessage: string; 
    constructor() {
        super("hub", "Dashboard", "home");
        this.welcomeMessage = `Welcome ${this.app.user.name.given}`;
    }

    async open() {
        PageHTML.title.textContent = this.welcomeMessage;
        PageHTML.main.appendChild(PageHTML.nav);
        PageHTML.get().forEach((page) => {
            page.nav.text = page.title;
        });
        this.nav.hide();
        return super.open();
    }

    async close() {
        PageHTML.header.appendChild(PageHTML.nav);
        PageHTML.get().forEach((page) => {
            page.nav.text = "";
        });
        this.nav.show();
        return super.close();
    }
}