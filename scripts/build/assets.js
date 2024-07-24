// checks what assets are in use and just grabs those
// however given assets pretty small, for now, grabs all of them

const fs = require('fs');
const path = require('path');

function copyDirectory(src,dest) {

    // make sure destination exists
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest,{recursive: true});
    }

    // reads the source directory
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

copyDirectory('assets','dist');