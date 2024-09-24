type ID = Record<string, any>;

async function getToken(claim?: string) {
    return Office.auth.getAccessToken(claim ? {
        authChallenge: claim
    } : {
        allowSignInPrompt: true,
        allowConsentPrompt: true,
        forMSGraphAccess: true
    });
}

async function postToken(token: string) {
    return fetch('/auth', {
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    });
}

export async function auth(claim?: string): Promise<ID> {
    const token = await getToken(claim);
    const response = await postToken(token);
    
    if (!response.ok) {
        const user: ID = await response.json();

        if (!claim && user.claim) {
            return auth(user.claim);
        }

        throw new Error('SSO Failed');
    }

    return response.json();
}