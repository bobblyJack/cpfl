import {
    PublicClientApplication,
    LogLevel,
    InteractionRequiredAuthError,
    AccountInfo
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
                            case LogLevel.Error:
                                console.error(message);
                                return;
                            case LogLevel.Info:
                                console.info(message);
                                return;
                            case LogLevel.Verbose:
                                console.debug(message);
                                return;
                            case LogLevel.Warning:
                                console.warn(message);
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

    if (!account) { // no active account
        account = msal.getAccount({
            tenantId: env.tenant
        });
    }

    if (!account) { // no account at all
        const response = await msal.loginPopup();
        account = checkAccount(response.account);
        return response;
    }

    return msal.ssoSilent({
        account: checkAccount(account)
    });

    function checkAccount(account: AccountInfo) {
        if (account.tenantId !== env.tenant) {
            throw new Error('invalid tenancy login');
        }
        msal.setActiveAccount(account);
        return account;
    }
}

export async function getToken() {
    const msal = await callMSAL();
    const scope = 'Files.Read';
    try {
        const req = await msal.acquireTokenSilent({
            scopes: [scope]
        });
        return req.accessToken;
    } catch (err) {
        if (err instanceof InteractionRequiredAuthError) {
            const req = await msal.acquireTokenPopup({
                scopes: [scope]
            });
            return req.accessToken;
        }
        throw err;
    }
}