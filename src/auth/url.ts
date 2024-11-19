export default function formURL(graphOrigin: string, graphVersion: string, path: string, select?: (keyof DriveItem)[]): URL {
    let parts: string[] = [
        graphVersion,
        ...path.split("/")
    ]

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