const graphOrigin: string = "https://graph.microsoft.com";
const graphVersion: string = "v1.0";

/**
 * form graph url (app scoped)
 * @param path relative to source
 * @param source drive/special/approot
 * @returns URL
 */
export default function formGraphURL(path: string, source?: "app"): URL;
/**
 * form graph url (user scoped)
 * @param path relative to source
 * @param source me/drive/special/approot
 * @returns URL
 */
export default function formGraphURL(path: string, source: "user"): URL;
// implementation
export default function formGraphURL(path: string, source: GraphScope = "app"): URL {
    let base = graphVersion;
    if (source === "user") {
        base += "/me";
    }
    base += "/drive/special/approot";
    if (!path.startsWith("/") && !path.startsWith(":")) {
        base += "/";
    }
    path = base + path;
    return new URL(path, graphOrigin);
}