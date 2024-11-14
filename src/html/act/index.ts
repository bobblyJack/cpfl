import { PageHTML } from "..";
import { ActiveMatter } from "./matter";

export default function (this: PageHTML) {
    
    this.title = "Active Matter";
    this.nav = "credentials";
    this.nav.flag("warn");

    this.opener = openPage;

    this.content = ActiveMatter.main;
    this.tray = ActiveMatter.footer;

    return this;
}

async function openPage(this: PageHTML) {
    ActiveMatter.testButton.hidden = !this.app.debug;
}