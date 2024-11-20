interface EnvConfig {
    id: string; // app client
    tenant: string; // app tenant
    host: string; // prod host
    site: { // sharepoint site
        id?: string;
        name: string;
        domain: string;
    };
}

type FetchMethod = 
    "GET"  | // retrieve resource - default
    "POST" | // submit data or create resource - not idempotent
    "PATCH" | // update fields of existing resource
    "DELETE" | // remove a resource

    /* uncommon methods */
    "PUT" | // completely replace or create a resource
    "HEAD" | // get resource metadata (headers only)
    "OPTIONS" | // get allowed fetch methods
    "TRACE" // loopback debug (returns the request)