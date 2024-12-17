import nullMatter from './null.html';
import { HeadPage } from "../../main";
import initCreation from './create';
import initImporter from './import';
import initLoader from './load';

export default function (page: HeadPage) {
    const nullSub = page.set('act_null');
    nullSub.nav.button.hidden = true;
    nullSub.main.innerHTML = nullMatter;
    initCreation(nullSub.main)
    initImporter(nullSub.main);
    initLoader(nullSub.main);
}