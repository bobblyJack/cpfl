import { PublicClientApplication } from "@azure/msal-browser";

export default async function(pca: Promise<PublicClientApplication>) {
    console.log('clearing msal cache')
    const msal = await pca;
    const activeAccount = msal.getActiveAccount();
    if (!activeAccount) {
        return;
    }
    return msal.clearCache({
        account: activeAccount
    });
} 