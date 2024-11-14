import { PageHTML } from "..";

export default function (this: PageHTML): PageHTML {
    
    this.title = "Balance Sheet";
    this.nav = "calculation";

    return this;
}

async function openPage(this: PageHTML) {

}
async function closePage(this: PageHTML) {

}