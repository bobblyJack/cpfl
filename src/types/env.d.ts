/**
 * local environment configuration
 */
interface EnvConfig {
    id: string; // app client
    tenant: string; // app tenant
    host: string; // prod host
    delta: EnvDeltaCache;
}

interface EnvDeltaCache { // @odata.deltaLinks
    [key: string]: string | URL;
}