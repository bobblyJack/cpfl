const {exec} = require('child_process');
const command = 'npx office-addin-dev-settings';
const manifest = "dist/manifest.xml";

function output(exr,std,err) {
    if (exr) {
        console.error(exr.message);
        throw exr;
    } else {
        console.log(std);
        if (err) {
            console.error(err);
        }   
    }
}

exec(`${command} registered`, output);
exec(`${command} appcontainer ${manifest}`, output);
exec(`${command} debugging ${manifest}`, output);
exec(`${command} live-reload ${manifest}`, output);
exec(`${command} source-bundle-url ${manifest}`, output);