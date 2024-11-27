import { 
    PublicClientApplication, 
    InteractionRequiredAuthError, 
    AuthenticationResult 
} from "@azure/msal-browser";

let PCA: PublicClientApplication

export async function set(client: string = "", tenant: string = "", refresh: boolean = false) {
    if (!PCA || refresh) {
        if (!client || !tenant) {
            throw new Error('local environment variables undefined');
        }
        PCA = new PublicClientApplication({
            auth: {
                clientId: client,
                authority: `https://login.microsoftonline.com/${tenant}`,
                redirectUri: `https://localhost:3000/redirect.html`
            },
            cache: {
                cacheLocation: "localStorage"
            },
            system: {
                loggerOptions: {
                    loggerCallback: (level, message, containsPii) => {
                        if (containsPii) {
                            return;
                        }
                        if (level <= 1) {
                            console.error(message);
                        } else {
                            console.log(message);
                        }
                    },
                },
            },
        });
        await PCA.initialize();
    }
    return PCA;
}

export async function get(): Promise<AuthenticationResult> {

    if (!PCA) {
        throw new Error('null msal instance');
    }

    const msal = await set();
    const account = msal.getActiveAccount();

    try {
        if (account) { // use account to get token
            return msal.acquireTokenSilent({
                scopes: [],
                account: account
            });

        } else { // login and set active account
            const accounts = msal.getAllAccounts({
                isHomeTenant: true
            });
            
            if (!accounts.length) {
                const res = await msal.ssoSilent({});
                msal.setActiveAccount(res.account);
                return res;
            } else if (accounts.length === 1) {
                msal.setActiveAccount(accounts[0]);
                return get();
            } else {
                const res = await msal.loginPopup({
                    scopes: [],
                    prompt: "select_account"
                });
                msal.setActiveAccount(res.account);
                return res;
            }
        }

    } catch (err) { // fallback to popup api
        if (err instanceof InteractionRequiredAuthError) {
            return msal.acquireTokenPopup({
                scopes: []
            });
        }
        console.error('auth req failed');
        throw err;
    }
}