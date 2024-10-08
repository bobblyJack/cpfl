import {jwtVerify, createRemoteJWKSet} from 'jose';
import env from '../env';

const tenancy = `https://login.microsoftonline.com/${env.tenant}`;
const JWKS = createRemoteJWKSet(new URL(`${tenancy}/discovery/v2.0/keys`));

async function getPayload(token: string) {
    const response = await jwtVerify(token, JWKS, {
        audience: env.client,
        issuer: `${tenancy}/v2.0`
    });
    return response.payload;
}

async function getToken(claim?: string): Promise<string> {
    return Office.auth.getAccessToken(claim ? {
        authChallenge: claim
    } : {
        allowSignInPrompt: true,
        allowConsentPrompt: true,
        forMSGraphAccess: true
    });

}

export async function getUser(): Promise<Record<string, any>> {
    const token = await getToken();
    return getPayload(token);
}

export async function getFiles(): Promise<Record<string, any>> {
    try {
        const path = env.drive + '/root/children';
        const token = await getToken();
        const response = await fetch('https://graph.microsoft.com/v1.0/drives/' + path, {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        return response.json();

    } catch (err) {
        console.log('oh no')
        console.error(err);
        throw err
    }
    
}