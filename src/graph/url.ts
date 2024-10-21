const graphOrigin: string = "https://graph.microsoft.com";
const graphVersion: string = "v1.0";

export function formURL(path: string, select?: SelectQuery): URL {
    let parts: string[] = [
        graphVersion,
        ...path.split("/")
    ]

    parts = parts.map(part => encodeURIComponent(part));
    path = parts.join("/");

    const url = new URL(path, graphOrigin);
    if (select && select.length) {
        const search = {
            $select: select.join(",")
        }
        url.search = new URLSearchParams(search).toString();
    }

    return url;
}