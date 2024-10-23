import { 
    PublicClientApplication,
    InteractionRequiredAuthError
} from "@azure/msal-browser";

type RequestParams = {
    msalClient: PublicClientApplication,
    addScopes?: string[]
}

export async function getAuth(context: RequestParams) {
    try {
        return afterRequest(context);
    } catch {
        return initRequest(context);
    }
}

async function initRequest(context: RequestParams) {
    try {
        return context.msalClient.ssoSilent({});
    } catch (err) {
        if (err instanceof InteractionRequiredAuthError) {
            return context.msalClient.loginPopup();
        }
        console.error('unknown login error');
        throw err;
    }
}

async function afterRequest(context: RequestParams) {
    const permission = {
        scopes: [
            ...(context.addScopes || [])
        ]
    }
    try {
        return context.msalClient.acquireTokenSilent(permission);
    } catch (err) {
        if (err instanceof InteractionRequiredAuthError) {
            return context.msalClient.acquireTokenPopup(permission);
        }
        console.error('acquisition request error');
        throw err;
    }
}