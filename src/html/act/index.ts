import CPFL from '../..';
import './style.css';
import nullMatter from './null.html';
import { HeadPage } from '../main';
import { MatterItem } from '../../matters';

function actLabels(key: string) {
    switch (key as ActSection) {
        case 'us': return "Client";
        case 'them': return "Other Side";
        case 'ship': return "Relationship";
        case 'kids': return "Children";
        case 'bar': return "Counsel";
        case 'null': return "No Matter Open";
    }
}

export default async function (app: CPFL) {
    
    const page = new HeadPage('act');
    page.labeller = actLabels;
    page.nav.button.classList.add("warn");

    // no active matter section
    
    const nullSub = page.set('act_null');
    nullSub.nav.button.hidden = true;
    nullSub.main.innerHTML = nullMatter;

    const newFileName = nullSub.main.querySelector('#new-matter input') as HTMLInputElement;
    const newButton = nullSub.main.querySelector('#new-matter button') as HTMLButtonElement;
    newButton.onclick = () => {
        if (!newFileName.value) {
            console.error('value needed for new matter file name');
        } else {
            MatterItem.create(newFileName.value);
        }
    }

    const importSection = nullSub.main.querySelector('#import-matter') as HTMLDivElement;
    if (app.mode !== "taskpane") {
        importSection.hidden = true;
    } else {
        const importButton = importSection.querySelector('button') as HTMLButtonElement;
        importButton.onclick = () => MatterItem.import();
    }

    const loadSection = nullSub.main.querySelector('#load-matter') as HTMLDivElement;
    const loadSelector = loadSection.querySelector('select') as HTMLSelectElement;
    const loadButton = loadSection.querySelector('button') as HTMLButtonElement;

    const map = await MatterItem.list();
    if (!map.size) {
        loadSection.hidden = true;
    } else {
        for (const [fileName, fileID] of Array.from(map.entries())) {
            const option = document.createElement('option');
            option.textContent = fileName;
            option.value = fileID;
            loadSelector.appendChild(option);
        }
    }

    loadButton.onclick = () => {
        try {
            const id = loadSelector.value;
            MatterItem.open(id)
        } catch (err) {
            console.error('error opening matter', err);
        }
    }

    // active matter sections

    const clientSection = page.set('act_us');
    const oppSection = page.set('act_them');
    const shipSection = page.set('act_ship');
    const kidsSection = page.set('act_kids');
    const counselSection = page.set('act_bar');

    // page loader

    page.loader = () => {
        if (MatterItem.current) {
            page.get('act_us').render();
            page.fnav.removeAttribute('hidden');
        } else {
            page.get('act_null').render();
            page.fnav.hidden = true;
        }
    }
    
}