const fs = require('fs');
const path = require('path');

// define recursive asset copying function
function copyDirectory(src,dest) {
    // make sure destination exists
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest,{recursive: true});
    }
    // read the source directory
    fs.readdirSync(src).forEach(thing => { 
        let orig = path.join(src,thing);
        let copy = path.join(dest,thing);
        // recursively copies directories
        if (fs.statSync(orig).isDirectory()) {
            copyDirectory(orig,copy);
        // copies files
        } else {
            fs.copyFileSync(orig,copy);
        }
    });
}

// copy assets and script
copyDirectory('assets','dist');
fs.copyFileSync('lib/taskpane.js','dist/script.js');