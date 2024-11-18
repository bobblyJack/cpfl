import { PageHTML } from "..";
import importActionstepMatter from './import';

export default function (page: PageHTML) {
    
    page.titleExt = "Active Matter";
    page.titleInt = "Select a Matter";
    page.nav.classList.add("warn");

    // containers - no file
    const main = page.set('div', 'main-0');
    page.main.appendChild(main);
    const footer = page.set('div', 'footer-0');
    page.footer.appendChild(footer);

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