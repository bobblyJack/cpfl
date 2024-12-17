import CPFL from '../..';
import './style.css';
import nullSub from './null';
import { HeadPage } from '../main';

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
    nullSub(page);

    // how do i cleanly get them to toggle back and forth between groups of feet.
    // do i literally add in groups ?
    // seems possibly overkill for just this use case
    // what about adding in disabling whole subs, or forcing overwrite where they cant get turned off?
    // also overkill possibly
    

    

    

    

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