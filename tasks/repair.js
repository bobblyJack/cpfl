// repair office-addin registration problems
const devSettings = require('office-addin-dev-settings');
const fs = require('fs');
const path = require('path');
const manifest = require('../src/manifest.json');

(async () => {
    try {
        const oldRegos = await devSettings.getRegisterAddIns();
        for (const man of oldRegos) {
            if (man.id !== manifest.Id) {
                console.log(`finding ${man.id}`);
                const manPath = path.resolve(man.manifestPath);
                if (fs.existsSync(manPath)) {
                    fs.accessSync(manPath);
                    console.log('found it')
                } else {
                    throw new Error("manifest doesn't exist");
                }
                console.log('unregistering add-in');
                await devSettings.unregisterAddIn(man.manifestPath);
            }
        }
        const cleanRegos = await devSettings.getRegisterAddIns();
        for (const man of cleanRegos) {
            if (man.id !== manifest.Id) {
                throw new Error(`${man.id} still registered`)
            }
        }
        return "repair successful";
    } catch (err) {
        console.error(`error caught: ${err.message}`)
    }
})();