/**
 * indents a string
 * @param stop iterations (defaults to once)
 * @returns a number of tabs
 */

export function tabs(stop:number): string;

/**
 * error handling
 * @param fn a function
 * @returns fn or an error
 */
export function attempt(fn:Function): Promise<any>;