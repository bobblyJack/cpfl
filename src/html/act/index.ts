import CPFL from '../..';
import './style.css';
import { HeadPage } from '../main';
import { FootPage } from '../section';
import { ActiveMatter } from "../../client/matter";
import importActionstepMatter from '../../client/actionstep';

enum ActSections {
    act, // page1, the client
    spouse, // page2, the other side, and their lawyer
    ship, // page3 relationship cohab dates etc
    kids, //page4, kids
    counsel, // page5, both barristers
}

export default async function (app: CPFL) {
    
    const page = new HeadPage('act');
    page.title = "Select a Matter";
    page.nav.button.classList.add("warn");

    // subpage - no file
    const sub0 = page.set("clear");


    
    const main = page.set('div', 'main-0');
    page.main.appendChild(main);
    const footer = page.set('nav', 'footer-0');
    page.fnav.appendChild(footer);

    // saved matter explorer
    //WIP const explorer = page.set('ul', 'explorer');



    // file opener buttons
    const newButton = page.set('button', 'new');
    newButton.textContent = "Create Matter";
    newButton.onclick = () => ActiveMatter.current = new ActiveMatter(1); // wip
    main.appendChild(newButton);

    const impButton = page.set('button', 'import');
    impButton.textContent = "Import Matter";
    impButton.onclick = importActionstepMatter;
    main.appendChild(impButton);

    // file close button
    const closeButton = page.set("button", "close");
    closeButton.textContent = "Close Current Matter";
    closeButton.onclick = () => ActiveMatter.current = null;

    return page;

}