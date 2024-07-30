const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

try {
    
    // fresh build removes old files first (excl. manifest)
    if (process.argv.slice(2) !== "debug") {
        fs.readdirSync('dist').forEach(item => {
            if (item !== 'manifest.xml') {
                fs.rmSync(path.join('dist',item), {recursive: true, force: true})
            }
        })
        console.log('building taskpane');
    } else {
        console.log('rebuilding taskpane')
    }

    // compile typescript
    exec('npx tsc');

    // basic recursive directory copying function for assets
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

    // copy assets, html, and css
    copyDirectory('assets','dist');
    fs.copyFileSync('src/index.html','dist/index.html');
    fs.copyFileSync('src/taskpane.html','dist/taskpane.html')
    fs.copyFileSync('src/styles.css','dist/styles.css');

    // finish build
    console.log('build successful');

// error handling
} catch (err) {
    if (err instanceof Error) {
        console.error(err.message);
    } else {
        console.error('unknown error caught');
    }
    throw err;
}

