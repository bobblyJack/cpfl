/**
 * indents a string by adding a number of tabs
 * @param stop iterations (default 1)
 * @param txt string to indent
 * @returns a number of tabs
 */
export function tabs(stop: number = 1, txt: string = "") {
    return '\t'.repeat(stop) + txt;
}

/**
 * error handling
 * @param fn a function
 * @returns fn or an error
 */
export async function attempt(fn: Function) {
    try {
        console.log(`attempting ${fn}`)
        const result = await fn();
        console.log(`attempt successful`)
        return result;
    } catch (lg: unknown) {
        if (lg instanceof Error) {
            console.error(`error! ${lg.message}`);
        } else {
            console.error(`unknown error! ${lg}`)
        }
        throw lg;
    }
}

export function exif(check:boolean) {
    if (check) {
        return;
    }
}