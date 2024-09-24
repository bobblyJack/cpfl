import * as MSAL from '@azure/msal-browser';
import env from '../env';

type ID = Record<string, any>;

async function fetchUser(token: string) {
    return fetch('/auth', {
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    });
}

async function getSSOToken(claim?: string) {
    return Office.auth.getAccessToken(claim ? {
        authChallenge: claim
    } : {
        allowSignInPrompt: true,
        allowConsentPrompt: true,
        forMSGraphAccess: true
    });
}

async function loginSSO(claim?: string): Promise<ID> {
    const token = await getSSOToken(claim);
    const response = await fetchUser(token);
    const user: ID = await response.json();
    if (!response.ok) {
        if (!claim && user.claim) {
            return loginSSO(user.claim);
        }
        throw new Error('SSO Failed');
    }
    return user;
}

let PCA: MSAL.PublicClientApplication;
async function getMSALToken(): Promise<string> {
    if (!PCA) {
        PCA = new MSAL.PublicClientApplication({
            auth: {
                clientId: env.client
            }
        })
        await PCA.initialize();
    }
    const config = {
        scopes: [env.scope]
    }
    try {
        const response = await PCA.acquireTokenSilent(config);
        return response.accessToken;
    } catch {
        const response = await PCA.loginPopup(config);
        return response.accessToken;
    }
}

async function loginMSAL(): Promise<ID> {
    const token = await getMSALToken();
    const response = await fetchUser(token);
    const user: ID = await response.json();
    if (!response.ok) {
        throw new Error ('MSAL Failed');
    }
    return user;
}

export async function login(): Promise<ID> {
    try {
        const user = await loginSSO();
        return user;
    } catch (ssoError) {
        console.error(ssoError);
        try {
            const user = await loginMSAL();
            return user;
        } catch (msalError) {
            console.error(msalError);
            throw msalError;
        }
    }
}