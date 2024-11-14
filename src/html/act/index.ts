import { PageHTML } from "..";
import { ActiveMatter } from "./matter";

export default function (this: PageHTML) {
    
    this.title = "Active Matter";
    this.nav = "credentials";
    this.nav.flag("warn");

    this.opener = openPage;
    this.closer = closePage;

    this.content = document.createElement('div');

    const importButton = document.createElement('button');
    importButton.id = "act-button-import";
    importButton.textContent = "Import Matter";
    importButton.onclick = () => ActiveMatter.import();
    this.content.appendChild(importButton);

    const closeButton = document.createElement('button');
    closeButton.textContent = "Close Matter";
    closeButton.onclick = () => {ActiveMatter.current = null}
    this.content.appendChild(closeButton);

    return this;
}

async function openPage(this: PageHTML) {
    PageHTML.title = "Active Matter";
}

async function closePage(this: PageHTML) {
    console.log('woop woop woop woop');
}