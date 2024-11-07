type AppMode = "taskpane" | "mobile" | "browser";

interface EnvConfig {
    id: string;
    host: string;
    tenant: string;
    site: {
        name: string;
        domain: string;
    };
}

interface UserConfig {
    id: string;
    name: {
        given: string;
        family: string;
        full: string;
    }
    email: string;
    admin: boolean;
}