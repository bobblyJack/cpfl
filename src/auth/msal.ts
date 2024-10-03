import {
    PublicClientApplication,
    InteractionRequiredAuthError
} from '@azure/msal-browser';
import env from '../env';

let PCA: PublicClientApplication;
async function callMSAL() {
    await Office.onReady();
    if (!PCA) {
        PCA = new PublicClientApplication({
            auth: {
                clientId: env.client,
                authority: `https://login.microsoftonline.com/${env.tenant}`
            },
            cache: {
                cacheLocation: 'localStorage',
                storeAuthStateInCookie: true
            },
            system: {
                loggerOptions: {
                    loggerCallback: (level, message, containsPii) => {
                        if (containsPii) {
                            return;
                        }
                        switch (level) {
                            case 0:
                                console.error(message);
                                return;
                            case 1:
                                console.warn(message);
                                return;
                            case 2:
                                console.info(message);
                                return;
                            case 3:
                                console.debug(message);
                                return;
                            default:
                                console.log(message);
                                return;
                        }
                    },
                },
            },
        });
        await PCA.initialize();
    }
    return PCA;
}

export async function getUser() {
    const msal = await callMSAL();
    let account = msal.getActiveAccount();

    if (!account || account.tenantId !== env.tenant) {
        const response = await logOn(msal);
        if (response.tenantId !== env.tenant) {
            throw new Error('invalid tenancy login');
        }
        account = response.account;
        msal.setActiveAccount(account); 
    }

    const user = account.idTokenClaims;
    if (!user) {
        throw new Error('user identity missing');
    }
    return user;

}

async function logOn(msal: PublicClientApplication) {
    const home = msal.getAccount({
        tenantId: env.tenant
    });
    if (!home) {
        return msal.loginPopup();
    }
    return msal.ssoSilent({
        account: home
    });
}


export async function getToken() {
    const msal = await callMSAL();
    const permission = {
        scopes: [
            'Files.Read.All',
            'Sites.Read.All'
        ]
    };
    try {
        const req = await msal.acquireTokenSilent(permission);
        return req.accessToken;
    } catch (err) {
        if (err instanceof InteractionRequiredAuthError) {
            const req = await msal.acquireTokenPopup(permission);
            return req.accessToken;
        }
        throw err;
    }
}