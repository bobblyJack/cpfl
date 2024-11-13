import { PageHTML } from "..";

export function createBal(page: PageHTML): PageHTML {
    //const page = new PageHTML('bal');
    page.title = "Balance Sheet";
    page.nav = "calculation";

    page.opener = openPage;
    page.closer = closePage;

    return page;
}

async function openPage(this: PageHTML) {

}
async function closePage(this: PageHTML) {

}