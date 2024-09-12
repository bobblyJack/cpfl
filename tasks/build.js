const fs = require('fs/promises');
const {exec} = require('child_process');
const OAM = require('office-addin-manifest');

const prod = false; // production toggle

(async () => {
    let domain = "https://localhost:3000";
    if (prod) {
        domain = "https://clarkpanagakos.sharepoint.com/taskpane";
    }
    fs.cp('assets', 'dist', {
        recursive: true,
        force: true
    });
    exec('npx webpack');
    const data = await fs.readFile('manifest.xml', 'utf-8');
    const manifest = data.replace(/%APPDOMAIN%/g, domain);
    await fs.writeFile('dist/manifest.xml', manifest, 'utf-8');
    return OAM.validateManifest('dist/manifest.xml');
})().then(status => {
    if (!status.isValid) {
        throw new Error('manifest invalid');
    }
    console.log(`${prod ? 'production' : 'development'} build complete.`);
});