import CPFL from "../..";
import getURL from '../url';
import authFetch from "../fetch";

/**
 * query shared approot for changes
 */
export default async function deltaRequest(cache: GraphCache) {
    const env = await CPFL.app.env();
    let delta = env.delta[cache];
    if (!delta) {
        delta = getURL(`:/${cache}:/delta`);
    }
    return fetchUpdates(env.delta, cache, delta);
}

async function fetchUpdates(
    env: EnvDeltaCache, 
    cache: GraphCache, 
    link: string | URL
): Promise<GraphDeltaItem[]> {
    let response: GraphDeltaResponse;
    let deltaLink: string | URL = "";
    const values = await collateValues(link);
    if (!deltaLink) {
        throw new Error('delta link undefined');
    }
    env[cache] = deltaLink;
    CPFL.app.env(env);
    return values;

    async function collateValues(
        dlink: string | URL, 
        values: GraphDeltaItem[] = [], 
        token: string | null = null) {
        try {
            if (!token) {
                token = await CPFL.app.access();
            }
            const res = await authFetch(dlink);
            response = await res.json();
            for (const item of response.value) {
                values.push(item);
            }
            if (response['@odata.nextLink']) {
                return collateValues(response['@odata.nextLink'], values, token);
            }
            if (response["@odata.deltaLink"]) {
                deltaLink = response["@odata.deltaLink"];
            }
            return values;
        } catch (err) {
            try {
                CPFL.app.debug.err('initial error fetching updates');
                CPFL.app.debug.log('attempting token refresh');
                return collateValues(dlink, values);
            } catch (err) {
                console.error('could not fetch updates', dlink, values);
                throw err;
            }
        }
    }
    
}