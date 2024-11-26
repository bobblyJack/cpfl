/**
 * App Platform Options
 * @tbd what are these actually doing?
 */
type AppMode = "taskpane" | "mobile" | "browser";

/**
 * App Colour Themes
 */
type AppTheme = "light" | "dark"

/**
 * local environment configuration
 */
interface EnvConfig {
    id: string; // app client
    tenant: string; // app tenant
    host: string; // prod host
    site: SharepointConfig;
}
interface SharepointConfig { // sharepoint site
    id?: string;
    name: string;
    domain: string;
    folders: SharepointFolders;
}
interface SharepointFolders { // folder paths
    matters: string;
    library: string;
    users: string;
}

