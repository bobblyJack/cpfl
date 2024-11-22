import { PageHTML } from '.';
import iicon from '../icons';
import { SubPage } from './section';

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

export class NavControl {
    target: PageHTML | SubPage;
    button: HTMLButtonElement;
    iicon: HTMLIconifyElement;
    label: HTMLLabelElement;
    constructor(target: PageHTML | SubPage) {
        this.target = target;
        this.button = document.createElement('button');
        this.button.onclick = target.render;
        this.iicon = iicon.create(target.key);
        this.button.appendChild(this.iicon);
        this.label = document.createElement('label');
        this.label.textContent = target.titleExt;
        this.button.appendChild(this.label);
    }
}