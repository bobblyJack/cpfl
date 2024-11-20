import { PageHTML } from "..";
import './style.css';
import importActionstepMatter from './import';

export default async function () {
    
    const page = PageHTML.get('act');
    page.titleInt = "Select a Matter";
    page.hnav.classList.add("warn");

    // containers - no file
    const main = page.set('div', 'main-0');
    page.main.appendChild(main);
    const footer = page.set('nav', 'footer-0');
    page.fnav.appendChild(footer);

    // saved matter explorer
    //WIP const explorer = page.set('ul', 'explorer');



    // file opener buttons
    const newButton = page.set('button', 'new');
    newButton.textContent = "Create Matter";
    newButton.onclick = () => console.log('placeholder');
    main.appendChild(newButton);

    const impButton = page.set('button', 'import');
    impButton.textContent = "Import Matter";
    impButton.onclick = importActionstepMatter;
    main.appendChild(impButton);

}