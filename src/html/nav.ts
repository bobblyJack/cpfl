import { PageHTML } from '.';
import { createIIcon } from '../icons';

export default function createNavButton(page: PageHTML): HTMLButtonElement {
    
    const button = document.createElement("button");
    button.onclick = () => PageHTML.display = page;

    let icon: HTMLIconifyElement;
    switch (page.key) {
        case "hub": 
            icon = createIIcon("nav-hub"); 
            break;
        case "act": 
            icon = createIIcon("nav-act"); 
            break;
        case "bal": 
            icon = createIIcon("nav-bal");
            break;
        case "lib": 
            icon = createIIcon("nav-lib");
            break;
        case "usr": 
            icon = createIIcon("nav-usr");
            break;
        default:
            icon = createIIcon("error");
    }
    button.appendChild(icon);

    if (page.key !== "hub") {
        const hub = PageHTML.get('hub');
        const hubButton = button.cloneNode(true) as HTMLButtonElement;
        hub.set('button', page.key, hubButton);
        hubButton.onclick = () => PageHTML.display = page;
        const hubLabel = document.createElement('p');
        hubLabel.textContent = page.titleExt;
        hubButton.appendChild(hubLabel);
        hub.main.appendChild(hubButton);
        PageHTML.nav.appendChild(button);
    } else {
        PageHTML.nav.prepend(button);
    }
    
    return button;
}