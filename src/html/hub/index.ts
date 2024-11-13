import { PageHTML } from "..";

export function initHub(this: PageHTML) { 

    this.title = "Dashboard";
    this.nav = "home";

    this.opener = openPage;
    this.closer = closePage;

}

async function openPage(this: PageHTML) {
    PageHTML.title = `Welcome ${this.app.user.name.given}`;
    PageHTML.get([]).forEach((page) => {
        page.nav.text = page.title;
    });
    this.nav.hide();

    PageHTML.main.appendChild(PageHTML.nav);
}

async function closePage(this: PageHTML) {
    PageHTML.get([]).forEach((page) => {
        page.nav.text = "";
    });
    this.nav.show();

    PageHTML.header.appendChild(PageHTML.nav);
}