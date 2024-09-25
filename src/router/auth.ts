async function getToken(claim?: string): Promise<string> {
    return Office.auth.getAccessToken(claim ? {
        authChallenge: claim
    } : {
        allowSignInPrompt: true,
        allowConsentPrompt: true,
        forMSGraphAccess: true
    });
}

async function postToken(token: string): Promise<Response> {
    return fetch('/auth', {
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    });
}

export async function auth(claim?: string): Promise<Record<string,any>> {
    const token = await getToken(claim);
    const response = await postToken(token);
    
    if (!response.ok) {
        if (!claim) {
            const json = await response.json()
            if (json.claim) {
                return auth(json.claim);
            }
        }
        throw new Error('SSO Failed');
    }

    return response.json();
}