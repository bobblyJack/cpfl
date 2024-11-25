import CPFL from "../..";
import { HeadPage } from "../main";
import { LibExplorer } from "./explorer";

export default async function (app: CPFL) {
    
    const page = new HeadPage("lib");

    const explorer = page.set('div', 'explorer');
    const pathLabel = page.set('h2', 'path');
    explorer.appendChild(pathLabel);
    const entityList = page.set('div', 'list');
    explorer.appendChild(entityList);

    LibExplorer.open().then(() => {
        page.main.appendChild(explorer);
    });

    return page;
    
}