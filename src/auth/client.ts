import {
    PublicClientApplication
} from '@azure/msal-browser';

export default async function (client: string, tenant: string) {
    const pca = new PublicClientApplication({
        auth: {
            clientId: client,
            authority: `https://login.microsoftonline.com/${tenant}`
        },
        system: {
            loggerOptions: {
                loggerCallback: (level, message, containsPii) => {
                    if (containsPii) {
                        return;
                    }
                    if (level <= 1) {
                        console.error(message);
                    } else {
                        console.log(message);
                    }
                },
            },
        },
    });
    await pca.initialize();
    return pca;
}