/**
 * App Platform Options
 * @tbd what are these actually doing?
 */
type AppMode = "taskpane" | "mobile" | "browser";

/**
 * Authenticated App User WIP
 */
interface AppUser {
    fname: string;
    gnames: string;
    email: string;
    theme: AppTheme;
    admin: boolean;
}

/**
 * App Colour Themes
 */
type AppTheme = "light" | "dark"

/**
 * App Debugger
 */
interface AppDebug {
    readonly status: boolean;
    log: (...args: any[]) => void;
    err: (...args: any[]) => void;
}

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

