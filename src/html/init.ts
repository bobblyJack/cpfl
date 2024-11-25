import CPFL from '..';
import initHub from './hub';
import initAct from './act';
import initLib from './lib';
import initBal from './bal';
import initUsr from './usr';

export default async function () {
    try {
        const app = CPFL.app;
        app.main.textContent = "loading active matters";
        const pageKeys: (keyof typeof app.html.keys)[] = ["hub", "act"];

        switch (app.mode) { // WIP: mode specific page loading
            case 'taskpane': pageKeys.push("lib");
            case 'browser': pageKeys.push("bal");
            case 'mobile': pageKeys.push("usr");
        }

        app.main.textContent = "initiating app pages";
        const pages = pageKeys.map((key) => { // map init functions
            switch (key) {
                case 'hub': return initHub;
                case 'act': return initAct;
                case 'bal': return initBal;
                case 'lib': return initLib;
                case 'usr': return initUsr;
            }
        }).map(init => init(app)); // then create pages

        await Promise.all(pages);

    } catch (err) {
        console.error('error on html init', err);
    }
    
}