import CPFL from "..";

const graphOrigin: string = "https://graph.microsoft.com";
const graphVersion: string = "v1.0";

export default async function(path: string, select?: (keyof DriveItem)[]): Promise<URL> {

    try {
        const app = CPFL.app;
        const env = await app.env;
        let siteID = env.site.id;
        if (!siteID) {
            siteID = await fetchSiteID(app, env);
        }
        path = `sites/${siteID}/drive/${path}`;

        const url = new URL(`${graphVersion}/${path}`, graphOrigin);

        if (select && select.length) {
            const search = {
                $select: select.join(",")
            }
            url.search = new URLSearchParams(search).toString();
        }
    
        return url;

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