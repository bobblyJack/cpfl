import { getEnv } from "../env";
import { authFetch } from "./fetch";
import { formURL } from "./url";

let siteID: string;

export async function getDrivePath(token: string) {
    if (!siteID) {
        const env = await getEnv(false);
        const req = `sites/${env.site.domain}:/sites/${env.site.name}?$select=id`;
        const res = await authFetch(token, formURL(req)) as Record<string, string>;
        siteID = res["id"];
    }
    return `sites/${siteID}/drive`   
}