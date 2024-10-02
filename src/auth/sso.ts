import { verifyJWT } from "./jwt";

export async function getSSO(): Promise<Record<string, any>> {
    const token = await fetchToken();
    return verifyJWT(token);
} // need to add retry to here later

function fetchToken(claim?: string) {
    let options: Office.AuthOptions;
    if (claim) {
        options = {
            authChallenge: claim
        }
    } else {
        options = {
            allowSignInPrompt: true,
            allowConsentPrompt: true,
            forMSGraphAccess: true
        }
    }
    return Office.auth.getAccessToken(options);
}