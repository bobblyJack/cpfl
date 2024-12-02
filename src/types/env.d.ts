/**
 * local environment configuration
 */
interface EnvConfig {
    id: string; // app client
    tenant: string; // app tenant
    host: string; // prod host
    site: { // sharepoint site
        id?: string;
        name: string;
        domain: string;
    }
    delta?: string | URL; // @odata.deltaLink
}