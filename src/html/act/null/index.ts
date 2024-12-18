import { HeadPage } from "../../main";
import nullMatter from './null.html';
import initCreation from './create';
import initImporter from './import';
import initLoader from './load';

export default function (page: HeadPage) {
    const nullSub = page.set('act_null');
    nullSub.nav.hide();
    nullSub.main.innerHTML = nullMatter;
    initCreation(nullSub.main)
    initImporter(nullSub.main);
    initLoader(nullSub.main);
    nullSub.loader = () => {
        for (const foot of page.feet) {
            if (foot.key !== 'act_null') {
                foot.hide();
            }
        }
        page.fnav.hidden = true;
    }
    
}