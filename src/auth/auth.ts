// figure out auth - needs graph data to get access to onedrive.
export async function auth(): Promise<any> {
    try {
        // get auth token
        const token = await Office.auth.getAccessToken({
            allowSignInPrompt: true,
            allowConsentPrompt: true,
            //forMSGraphAccess: true <- for production deployment only, breaks on sideload.
            //authChallenge: if auth fails it returns a descriptive error that involves this, which you use for a second attempt
        });
    
        const response = await fetch('/getuserdata', {
            method: 'GET',
            headers: {
                Authorization: "Bearer " + token
            }
        });

        return response.json();

    } catch (err) {
        console.error("auth error", err);
    }
    
}

