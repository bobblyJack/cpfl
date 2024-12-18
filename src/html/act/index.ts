import CPFL from '../..';
import './style.css';
import nullSub from './null';
import usSub from './us';
import { HeadPage } from '../main';
import { AppMatter } from '../../matters';
import { FootPage } from '../section';

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
    page.nav.flag();

    // no active matter section
    nullSub(page);

    // active matter sections
    usSub(page);
    
    const oppSection = page.set('act_them');
    const shipSection = page.set('act_ship');
    const kidsSection = page.set('act_kids');
    const counselSection = page.set('act_bar');

    page.loader = () => {
        if (!AppMatter.current) {
            app.html('act').get('act_null').render();
        }
    }

    return page;
    
}