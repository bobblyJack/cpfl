import {
    PublicClientApplication
} from '@azure/msal-browser';
import { getEnv } from '../env';

export async function initMSAL(refresh: boolean) {
    const env = await getEnv(refresh);
    return createMSAL(env);
}

async function createMSAL(env: EnvConfig) {
    const pca = new PublicClientApplication({
        auth: {
            clientId: env.id,
            authority: `https://login.microsoftonline.com/${env.tenant}`
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