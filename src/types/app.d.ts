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
 * App Debugger
 */
interface AppDebug {
    readonly status: boolean;
    log: (...args: any[]) => void;
    err: (...args: any[]) => void;
}