/* 
 * the recursive thing manipulator
 * a possibly needless creation
*/

import * as fs from 'fs';
import * as path from 'path';

class Thing {

    public path: string;

    constructor(input:fs.PathLike) {
        this.path = path.resolve(input.toString());
    }


}

/** directory checker */
async function evaluate(path: string): Promise<boolean> {
    try {
        return await fs.promises.stat(path).then(stats => {
            return stats.isDirectory();
        });
    } catch {
        return false;
    }
}

// ASYNC MODULAR FUNCTIONS

export async function inflate(thing: fs.PathLike | fs.PathLike[]): Promise<string | string[]> {
    // get something
    if (!Array.isArray(thing)) {
        const result = validate(thing);
        if (await evaluate(result)) {
            return fs.promises.readdir(result);
        } else {
            return result;
        }
    // or somethings
    } else {
        const things = await Promise.all(thing.map(item => inflate(item)));
        const seen = new Set<string>();
        const result = things.flat().filter(item => {
            if (seen.has(item)) {
                return false;
            } else {
                seen.add(item);
                return true;
            }
        });
        return result;
    }
}

export async function create(thing: fs.PathLike | fs.PathLike[], where: fs.PathLike = "") {
    let dest:string = validate(where);
    if (!await evaluate(dest)) {
        // if it is not a directory, or if it does not exist
        

    }
    // make something
    if (!Array.isArray(thing)) {
        const name = validate(thing);
        if (await evaluate(name)) {

            return;

        } else {

            return;

        }
    // or somethings
    } else {
        return
    }


    if (!evaluate(dest)) {
        try {
            fs.accessSync(dest);
            return;
        } catch {
            dest = path.dirname(dest);
        }
    }

    if (!await fs.access(dest).then(() => true).catch(() => false)) {
        await fs.mkdir(dest, { recursive: true });
    }

    if (!thing) {
        return;
    } else if (Array.isArray(thing)) {
        await Promise.all(thing.map(item => create(item, dest)));
    } else {
        const file: string = path.join(dest, thing);
        if (await fs.access(file).then(() => true).catch(() => false)) {
            return;
        }
        await fs.writeFile(file, "", 'utf-8');
    }
}

export async function update(thing: string | string[], what: string | string[]) {
    // change something(s)
}

export async function deflate(thing: string | string[]) {
    // lose something(s)
}

// MULTI-USE MANIPULATOR FUNCTION
export async function manipulate() {
    // combine functions
}

// ALIASES
const man = manipulate;

// do i need to module.export here?