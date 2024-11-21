import { 
    PublicClientApplication, 
    InteractionRequiredAuthError, 
    AuthenticationResult 
} from "@azure/msal-browser";

export default async function authReq(msal: PublicClientApplication): Promise<AuthenticationResult> {

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
                return authReq(msal);
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