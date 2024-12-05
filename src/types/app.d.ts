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
 * App Debugger
 */
interface AppDebug {
    readonly status: boolean;
    log: (...args: any[]) => void;
    err: (...args: any[]) => void;
}

