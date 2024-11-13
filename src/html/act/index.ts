import { PageHTML } from "..";
import { ActiveMatter } from "./matter";

let testButtonClicks = 0;
let testButtonArmed: boolean = false;

export function createAct(page: PageHTML): PageHTML {
    //const page = new PageHTML('act');
    page.title = "Active Matter";
    page.nav = "credentials";
    page.nav.flag("warn");

    page.opener = openPage;
    page.closer = closePage;

    page.content = document.createElement('div');

    const importButton = document.createElement('button');
    importButton.id = "act-button-import";
    importButton.textContent = "Import Matter";
    importButton.onclick = ActiveMatter.import;
    page.content.appendChild(importButton);

    const testButton = document.createElement('button');
    testButton.textContent = "Test Me";
    testButton.onclick = () => {
        testButtonClicks++;
        console.log('attempt number', testButtonClicks);
        try {
            ActiveMatter.current.then(file => {
                console.log(file);
                if (testButtonArmed) {
                    ActiveMatter.current = null;
                    testButtonArmed = false;
                } else {
                    console.log('test button is now armed and ready');
                    testButtonArmed = true;
                }
            });
        } catch (err) {
            console.error(err);
        }
    }
    page.content.appendChild(testButton);

    return page;
}

async function openPage(this: PageHTML) {
    PageHTML.title = this.title;
}

async function closePage(this: PageHTML) {

}