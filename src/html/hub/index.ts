import CPFL from '../..';
import { HeadPage } from '../main';
import './style.css';

export default async function (app: CPFL) {
    const hub = new HeadPage("hub", `Welcome ${app.user.name.given}`);
    hub.loader = () => populateDashboard(hub);
}

function populateDashboard(hub: HeadPage) {
    const text = hub.app.hnav.innerHTML;
    hub.main.innerHTML = text;
    const hb = hub.main.querySelector('button .hub');
    if (hb) {
        hb.remove();
    }
    const buttons = Array.from(hub.main.querySelectorAll('button'));
    for (const button of buttons) {
        try {
            const page = hub.app.html(button.className as PageKey);
            const label = document.createElement('label');
            label.textContent = page.label;
            button.appendChild(label);
        } catch (err) {
            console.error('error labelling hub nav', button);
        }
    }

    hub.loader = undefined;
}