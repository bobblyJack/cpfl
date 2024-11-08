interface EnvConfig {
    id: string;
    host: string;
    tenant: string;
    site: {
        name: string;
        domain: string;
    };
}