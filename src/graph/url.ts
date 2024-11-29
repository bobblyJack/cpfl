import CPFL from "..";

const graphOrigin: string = "https://graph.microsoft.com";
const graphVersion: string = "v1.0";

type GraphScope = "user" | "app" | "site"

export default async function(path: string[], source: GraphScope = "site"): Promise<URL> {
    const parts = [graphVersion];
    try {
        if (source === "user") {
            parts.push("me");
        } else {
            parts.push("sites");
            const app = CPFL.app;
            const env = await app.env;
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

    const res = await app.fetch(url);
    const site = await res.json() as Record<string, string>;
    
    env.site.id = site.id;
    app.env = env;
    return site.id;
}