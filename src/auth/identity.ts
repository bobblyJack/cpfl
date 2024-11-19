import {
    PublicClientApplication,
    IdTokenClaims,
    InteractionRequiredAuthError
} from "@azure/msal-browser";

// returns id token claims
export default async function(msal: PublicClientApplication): Promise<IdTokenClaims> {

    let account = msal.getActiveAccount();

    if (!account) {
        try {
            const req = await msal.ssoSilent({});
            account = req.account;
        } catch (err) {
            if (err instanceof InteractionRequiredAuthError) {
                const req = await msal.loginPopup();
                account = req.account;
            } else {
                console.error('unknown login error');
                throw err;
            }
        }
    }

    msal.setActiveAccount(account);

    const claims = account.idTokenClaims;
    if (!claims) {
        throw new Error('account identity undefined');
    }

    return claims;
}

