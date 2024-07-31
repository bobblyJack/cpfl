const OADS = require('office-addin-dev-settings');
const OAM = require('office-addin-manifest');

(async () => {
    try {
        const manifests = await OADS.getRegisterAddIns()
        for (const manifest of manifests) {
            const manifestStatus = await OAM.validateManifest(manifest.manifestPath);
            if (manifestStatus.isValid) {
                console.log('manifest valid');
                const container = await OADS.getAppcontainerNameFromManifest(manifest.manifestPath);
                if (OADS.isAppcontainerSupported()) {
                    console.log(`app container supported\n > ${container}`);
                } else {
                    throw new Error('app container unsupported')
                }
            } else {
                throw new Error(`manifest ${manifest.id} invalid`)
            }
        }
    } catch (e) {
        console.error(e.message);
    }
})();