const localKey = 'cpfl-env';
const localPath = './config.json';

interface EnvConfig {
    id: string;
    host: string;
    tenant: string;
    site: {
        name: string;
        domain: string;
    };
}

let configCache: Promise<EnvConfig>;

export async function getEnv(refresh: boolean) {
    if (!configCache || refresh) {
        configCache = fetchEnv(refresh);
    }
    return configCache;
}

async function fetchEnv(refresh: boolean) {

    let localValue = localStorage.getItem(localKey);

    if (!localValue || refresh) {

        const response = await fetch(localPath);

        if (!response.ok) {
            console.error('Env Fetch Error');
            throw new Error(response.statusText);
        }

        localValue = await response.text();
        localStorage.setItem(localKey, localValue);

    }

    const env = JSON.parse(localValue) as EnvConfig;
    configCache = Promise.resolve(env);

    return configCache;

}