import CPFL from '..';
import initHub from './hub';
import initAct from './act';
import initLib from './lib';
import initBal from './bal';
import initUsr from './usr';

export default async function () {
    try {
        const app = CPFL.app;
        app.main.textContent = "initiating app pages";
        const pageKeys: HeadKey[] = ["hub", "act"];

        switch (app.mode) { // WIP: mode specific page loading
            case 'taskpane': pageKeys.push("lib");
            case 'browser': pageKeys.push("bal");
            case 'mobile': pageKeys.push("usr");
        }

        const pagesInits = pageKeys.map((key) => { // map init functions
            switch (key) {
                case 'hub': return initHub;
                case 'act': return initAct;
                case 'bal': return initBal;
                case 'lib': return initLib;
                case 'usr': return initUsr;
            }
        });
        const pages = pagesInits.map(init => init(app)); // then call inits

        await Promise.all(pages);

        return app.html('hub').render();

    } catch (err) {
        console.error('error on html init', err);
    }
    
}