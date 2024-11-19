import { PageHTML } from "..";
import * as graph from '../../auth/graph';
import { createIIcon } from "../../icons";

export default function (page: PageHTML) {
    
    page.titles = "Precedent Library";
    console.log('fetching file explorer');
    initExplorer(page);
    
}

async function initExplorer(page: PageHTML) {
    const token = await page.app.token([]);
    const root = await graph.getCollection(token);
    const explorer = page.set('ul', 'explorer');

    for (const item of root) {
        const entry = page.set('li', item.id);
        
        let icon: HTMLIconifyElement;
        if (item.file) {
            icon = createIIcon("file");
        } else if (item.folder) {
            icon = createIIcon("folder");
        } else {
            icon = createIIcon("missing");
        }
        entry.appendChild(icon);
        const label = document.createElement("span");
        label.textContent = item.name;
        entry.appendChild(label);

        explorer.appendChild(entry);
        
    }

    page.main.appendChild(explorer);
    console.log('file explorer appended to lib');

}