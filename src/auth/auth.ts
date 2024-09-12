// figure out auth - needs graph data to get access to onedrive.
async function auth() {
    try {
        const token = await Office.auth.getAccessToken({
            allowSignInPrompt: true,
            allowConsentPrompt: true,
            //forMSGraphAccess: true <- for production deployment only, breaks on sideload.
            //authChallenge: if auth fails it returns a descriptive error that involves this, which you use for a second attempt
        });
    } catch (err) {
        console.error("error getting access token", err);
    }
}