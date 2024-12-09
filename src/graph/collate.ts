import authFetch from "./fetch";

export default async function collItems(link: string | URL): Promise<GraphItem[]>;
export default async function collItems(link: string | URL, delta: true): Promise<GraphItemCollection>;
export default async function collItems(link: string | URL, delta?: boolean, value?: GraphItem[]): Promise<GraphItem[] | GraphItemCollection>;
export default async function collItems( // implementation
    link: string | URL, 
    delta: boolean = false,
    value: GraphItem[] = [] 
    ): Promise<GraphItem[] | GraphItemCollection> {
    try {
        const res = await authFetch(link);
        const body: GraphItemCollection = await res.json();
        for (const item of body.value) {
            value.push(item);
        }
        if (body['@odata.nextLink']) {
            return collItems(body['@odata.nextLink'], delta, value);
        }
        if (delta) {
            const dlink = body["@odata.deltaLink"];
            if (!dlink) {
                throw new Error('delta link undefined');
            }
            return {
                value, 
                "@odata.deltaLink": dlink
            }
        }
        return value;
    } catch (err) {
        console.error('error collating graph items', link);
        return value;
    }
}