import { fetchEnv } from "./env";
import { fetchUser } from "./user";

const localKey = 'cpfl-config';
const localPath = './config.json';

let configCache: Promise<AppConfig>;

export async function getConfig(refresh: boolean = false): Promise<AppConfig> {
    if (!configCache || refresh) {
        configCache = fetchConfig(refresh);
    }
    return configCache;
}

async function fetchConfig(refresh: boolean) {

    let localValue = localStorage.getItem(localKey);

        if (!localValue || refresh) {
            const localEnv = await fetchEnv(localPath);
            const localUser = await fetchUser(localEnv);

            const config = {
                env: localEnv,
                user: localUser
            }

            localValue = JSON.stringify(config);
            localStorage.setItem(localKey, localValue);

            configCache = Promise.resolve(config);
        }

    return configCache

}