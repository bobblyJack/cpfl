import {
    PublicClientApplication
} from '@azure/msal-browser';
import { getEnv } from '../env';

let PCA: Promise<PublicClientApplication>;

export async function getMSAL(refresh: boolean) {
    if (!PCA || refresh) {
        const env = await getEnv(refresh);
        PCA = initMSAL(env);
    }
    return PCA;
}

async function initMSAL(env: EnvConfig) {
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
    PCA = Promise.resolve(pca);
    return PCA;
}