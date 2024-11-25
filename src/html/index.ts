import init from './init';
import { BaseHTML } from './base';
import { HeadPage } from './main';

enum AppPages { // page key & label
    "hub" = "Dashboard",
    "act" = "Active Matter",
    "lib" = "Precedent Library",
    "bal" = "Balance Sheet",
    "usr" = "User Settings"
}

const index: Map<keyof typeof AppPages, HeadPage> = new Map(); // full page map;

/**
 * page search function
 * @returns () gets current page
 */
function search(): HeadPage;
/**
 * page search function
 * @returns specific page
 */
function search(key: string): HeadPage;
/**
 * page search function
 * @returns whole page collection
 */
function search(all: []): HeadPage[];
/**
 * page search function
 * @returns specific pages
 */
function search(keys: string[]): HeadPage[];

function search( // search function implementation
    req?: string | string[]
): HeadPage | HeadPage[] {
    if (Array.isArray(req)) {
        if (!req.length) {
            return Array.from(index.values());
        }
        const pages: HeadPage[] = []
        for (const key of req) {
            try {
                pages.push(search(key));
            } catch (err) {
                console.error(err);
            }
        }
        return pages;
    } else if (req) {
        const page = index.get(req as keyof typeof AppPages);
        if (!page) {
            throw new Error(`invalid get request: ${req}`);
        }
        return page;
    }
    return BaseHTML.display.head;
}

export default {
    keys: AppPages,
    init: init,
    get: search,
    set: (page: HeadPage) => {
        index.set(page.key as keyof typeof AppPages, page);
    }
}