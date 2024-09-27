/**
 * Ext -> Mime
 * @param ext file extension
 * @returns mime-type
 */
export function getMime(ext: string) {
    switch (ext) {
        // text
        case ".html": return "text/html";
        case ".css": return "text/css";
        case ".ts": return "text/plain";
        case ".txt": return "text/plain";
        // apps
        case ".js": return "application/javascript";
        case ".json": return "application/json";
        case ".map": return "application/json";
        case ".xml": return "application/xml";
        // images
        case ".png": return "image/png";
        case ".jpg": return "image/jpeg";
        case ".gif": return "image/gif";
        case ".ico": return "image/x-icon";
        // fonts
        case ".ttf": return "font/ttf";
        // otherwise
        default: return "application/octet-stream";
    }
}