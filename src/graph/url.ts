import CPFL from "..";
import authFetch from "./fetch";

const graphOrigin: string = "https://graph.microsoft.com";
const graphVersion: string = "v1.0";

// root calls
// GET me/drive/special/approot (user-specific)
// GET sites/{site-id}/drive/special/approot (non-user specific, not shared to users)
// GET sites/{site-id}/drive/root/delta?$filter=(name ne 'Apps') (library) (hide the Apps folder though)

export default async function formGraphURL(path: string[], source: GraphScope = "site"): Promise<URL> {
    const parts = [graphVersion];
    try {
        if (source === "user") {
            parts.push("me");
        } else {
            parts.push("sites");
            const app = CPFL.app;
            const env = await app.env();
            let siteID = env.site.id;
            if (!siteID) {
                siteID = await fetchSiteID(app, env);
            }
            parts.push(siteID);
        }

        parts.push("drive");

        if (source !== "site") {
            parts.push("special", "approot");
        }

        parts.concat(path);
        
        return new URL(parts.join("/"), graphOrigin);

    } catch (err) {
        console.error('error forming graph URL');
        throw err;
    }
}

async function fetchSiteID(app: CPFL, env: EnvConfig) {
    const path = `sites/${env.site.domain}:/sites/${env.site.name}`;
    const url = new URL(`${graphVersion}/${path}`, graphOrigin);

    const res = await authFetch(url);
    const site = await res.json() as Record<string, string>;
    
    env.site.id = site.id;
    app.env(env);
    return site.id;
}