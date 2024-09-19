import jwt from 'jsonwebtoken';
//import {JwksClient} from 'jwks-rsa';
//import {formURLEncode} from './server/form';
//import * as MSAL from '@azure/msal-browser';

/*
there are two types of tokens. Identity tokens, and access tokens.
the one i can grab from OFfice is both.
i should use it for identity not access
then i should pass it via server to get an access token for graph
i should rerequest the id token if i need it again
i shouldnt cache the access token? i think msal does this automatically as well

*/

export async function getUser() {
    try {
        const token = await Office.auth.getAccessToken({
            allowSignInPrompt: true,
            allowConsentPrompt: true,
            forMSGraphAccess: true
        });
    
        return jwt.decode(token) as jwt.JwtPayload;

    } catch (err) {
        console.error(err);
        throw err;
    }  
}

//the middle tier goes from ssoauth to msgraph.
//jwt and jwks are used for auth
//msal is used for fallback auth

/* list of functions (from taskpane-sso)
- get sso auth token (Office.auth)
- get msal auth token (fallback via logon page)
- get data
    event trigger that gets a token then uses it to request a json response
- write data
    use json response in office to do X
- router (server handling)
    middle tier server script that routes a getdata req.url
    takes the auth token passed to it, returns the json response
- 3 parts for access token handling (from ssoauth helper)
    get signing keys using jwks
    validate jwt
    and parse url encoded form
    use those things plus the auth token to make the req to MS
    return their response
    i think this bit is the "on behalf of" flow
    it is taking my token and then returning a new token
- 2 parts for graph handling (from msgraph helper)
    this takes the new token from auth
    it parses it to check for errors
    then it uses it to fetch data from MS
    finally we have data to return to our initial response request
*/

// HOLD UP. let's check out the SPA thing. it redirects to login / logout pages which is probably what i should actually be doing.
// i think i was looking at the wrong auth sample.