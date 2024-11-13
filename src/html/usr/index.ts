import { PageHTML } from "..";

export function createUsr(page: PageHTML): PageHTML {
    //const page = new PageHTML('usr');
    page.title = "User Settings";
    page.nav = "settings";

    page.opener = openPage;
    page.closer = closePage;

    return page;
}

async function openPage(this: PageHTML) {

}
async function closePage(this: PageHTML) {

}