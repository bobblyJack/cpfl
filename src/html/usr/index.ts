import { PageHTML } from "..";

export default function (this: PageHTML): PageHTML {
    
    this.title = "User Settings";
    this.nav = "settings";

    return this;
}

async function openPage(this: PageHTML) {

}
async function closePage(this: PageHTML) {

}