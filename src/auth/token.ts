import { 
    PublicClientApplication,
    InteractionRequiredAuthError
} from "@azure/msal-browser";

export default async function (pca: Promise<PublicClientApplication>, addedScopes: string[]) {
    const msal = await pca;
    const permission = {
        scopes: [
            ...(addedScopes)
        ]
    }
    try {
        const req = await msal.acquireTokenSilent(permission);
        return req.accessToken;
    } catch (err) {
        if (err instanceof InteractionRequiredAuthError) {
            const req = await msal.acquireTokenPopup(permission);
            return req.accessToken;
        }
        console.error('acquisition request error');
        throw err;
    }
}