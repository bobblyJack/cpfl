import init from './init';
import { BaseHTML } from './base';
import { HeadPage } from './main';

/**
 * full page map
 */
const index: Map<HeadKey, HeadPage> = new Map();

/**
 * page search function
 * @returns () gets current page
 */
function get(): HeadPage | null;
/**
 * page search function
 * @returns specific page
 */
function get(key: HeadKey): HeadPage;
/**
 * page search function
 * @returns whole page collection
 */
function get(all: []): HeadPage[];
/**
 * page search function
 * @returns specific pages
 */
function get(keys: HeadKey[]): HeadPage[];

function get( // search function implementation
    req?: HeadKey | HeadKey[]
): HeadPage | HeadPage[] | null {
    if (Array.isArray(req)) {
        if (!req.length) {
            return Array.from(index.values());
        }
        const pages: HeadPage[] = []
        for (const key of req) {
            try {
                pages.push(get(key));
            } catch (err) {
                console.error(err);
            }
        }
        return pages;
    } else if (req) {
        const page = index.get(req);
        if (!page) {
            throw new Error(`invalid get request: ${req}`);
        }
        return page;
    }
    return BaseHTML.display.head;
}

/**
 * page register function
 */
function set(page: HeadPage) {
    index.set(page.key as HeadKey, page);
}

export default {
    init, get, set
}