import { PageHTML } from "..";

export function createLib(page: PageHTML): PageHTML {
    //const page = new PageHTML('lib');
    page.title = "Precedent Library";
    page.nav = "document";

    page.opener = openPage;
    page.closer = closePage;

    return page;
}

async function openPage(this: PageHTML) {

}
async function closePage(this: PageHTML) {

}