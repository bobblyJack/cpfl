const graphOrigin: string = "https://graph.microsoft.com";
const graphVersion: string = "v1.0";

/**
 * form scoped graph url
 * @param path relative to source
 * @param sourceApp drive/special/approot
 * @param sourceUser me/drive/special/approot
 * @returns URL
 */
export default function formGraphURL(path: GraphURLFragment, source: GraphScope = "app"): URL {
    let base = graphVersion;
    if (source === "user") {
        base += "/me";
    }
    base += "/drive/special/approot";
    path = base + path;
    return new URL(path, graphOrigin);
}