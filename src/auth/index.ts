export * from './sso';
export * from './msal';
export * from './jwt';
export * from './graph';
export * from './form';

async function getAuth() {

    
    /*
    const user = await getUser();
    const msal = await callMSAL();

    let account = msal.getAccount({localAccountId: user.name});
    if (!account) {
        const response = await msal.loginPopup({
            scopes: [`api://${window.location.host}/${env.client}/access_as_user`],
            extraScopesToConsent: ["Files.Read"]
        });
        account = response.account;
    }
    
    if (account.tenantId !== env.tenant) {
        throw new Error('logged into wrong tenancy')
    }*/

    //const login = await msal.ssoSilent({
    //    account: account
    //});

    //return login;

}




        /* try {
        const token = await Office.auth.getAccessToken({
            allowSignInPrompt: true,
            allowConsentPrompt: true
        });
        return callback(token);
    } catch (errorSSO) {
        console.log(errorSSO);
        try {
            const msal = await callMSAL();
            //const user = await getUser();
            const response = await msal.ssoSilent({
                scopes: ["Files.ReadWrite"],
                //loginHint: user.email
            });
            for (const [key, value] of Object.entries(response)) {
                console.log(`${key}: ${value}`); // debug response properties
            }
            const token = response.accessToken;
            return callback(token);
        } catch (errorMSAL) {
            console.error(errorMSAL);
            throw new Error('auth error');
        }
    } */