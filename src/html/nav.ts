import { PageHTML } from '.';
import { createIIcon } from '../icons';

export default function createNavButton(page: PageHTML): HTMLButtonElement {
    
    const button = document.createElement("button");
    button.onclick = () => PageHTML.display = page;

    let icon: HTMLIconifyElement;
    try {
        icon = createIIcon(`nav-${page.key}`);
    } catch {
        icon = createIIcon('error');
    }
    
    button.appendChild(icon);
    PageHTML.hnav.appendChild(button);

    if (page.key !== "hub") {
        const hub = PageHTML.get('hub');
        const hubButton = button.cloneNode(true) as HTMLButtonElement;
        hub.set('button', page.key, hubButton);
        hubButton.onclick = () => PageHTML.display = page;
        const hubLabel = document.createElement('p');
        hubLabel.textContent = page.titleExt;
        hubButton.appendChild(hubLabel);
        hub.main.appendChild(hubButton);  
    }
    
    return button;
}