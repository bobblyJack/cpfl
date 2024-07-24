/* 
* the recursive container manipulator
*/

import * as fs from 'fs';
import * as path from 'path';

/* HELPER FUNCTIONS */

function validate(pathy: fs.PathLike) {
    // path cleaner
    if (pathy) {
        return path.resolve(pathy.toString());
    } else {
        return "";
    }
}

function evaluate(thing: string) {
    // directory checker
    if (thing) {
        return (fs.statSync(validate(thing)).isDirectory());
    } else {
        return false;
    }
}

/* MODULE FUNCTIONS */

export function inflate(thing: string | string[] = ""): string | string[] {
    // get something(s)
    if (Array.isArray(thing)) {
        const things = thing.map(item => inflate(item)).flat();
        const seen = new Set<string>();
        const result = things.filter(item => {
            if (seen.has(item)) {
                return false;
            } else {
                seen.add(item);
                return true;
            }
        });
        return result;
    } else if (evaluate(thing)) {
        return fs.readdirSync(validate(thing));
    } else {
        return validate(thing);
    }
}

export function create(thing: string | string[] = "", where: fs.PathLike = "") {
    // make something(s)
    let dest: string = validate(where);
    if (!evaluate(dest)) {
        if (fs.existsSync(dest)) {
            return;
        }
        dest = path.dirname(dest);
    }
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest,{recursive: true});
    }
    if (!thing) {
        return;
    } else if (Array.isArray(thing)) {
        return thing.forEach(item => {create(item,dest)})
    } else {
        const file: string = path.join(dest,thing);
        if (fs.existsSync(file)) {
            return;
        }
        return fs.writeFileSync(file,"",'utf-8')
    }
}

function update(thing: string | string[], destination: fs.PathLike) {
    // change something(s)
}

function deflate(thing: string | string[]) {
    // lose something(s)
}

// multi-use modular function
function manipulate(source, destination = source, mode = "R") {

    // only accept specific modes
    if (!modes.includes(mode)) {
        return;
    }

    // iterate arrayed paths
    if (Array.isArray(source)) {
        source.forEach(item => {
            manipulate(item,destination,mode)
        })
    }
    if (Array.isArray(destination)) {
        destination.forEach(item => {
            manipulate(source,item,mode)
        })
    }

    // normalise itemised paths
    const src = path.normalize(source);
    const dest = path.normalize(destination);
    
    // read mode

    if (mode === "R" || mode === "read") {
        if (fs.statSync.isDirectory()) {

        }
    }

    // 

    // reads the source directory
    fs.readdirSync(src).forEach(thing => { 
        let orig = path.join(src,thing);
        let copy = path.join(dest,thing);

        // recursively copies directories
        if (fs.statSync(orig).isDirectory()) {
            manipulate(orig,copy);
        // copies files
        } else {
            fs.copyFileSync(orig,copy);
        }
    });





}

// shorter manipulator alias
const man = manipulate;

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