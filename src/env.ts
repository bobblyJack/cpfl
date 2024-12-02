// cache local environment variables to localStorage

const localKey: string = 'app-env';
const localPath: string = './config.json';
let localEnv: Promise<EnvConfig>;

export async function get(refresh: boolean = false) {
    if (refresh) {
        console.log('refreshing local env');
    }
    if (!localEnv || refresh) {
        localEnv = fetching(refresh);
    }
    return localEnv;

    async function fetching(refresh: boolean): Promise<EnvConfig> {
        let env: EnvConfig;
        let localValue = localStorage.getItem(localKey);
        if (!localValue || refresh) {
            const response = await fetch(localPath);
            if (!response.ok) {
                console.error('Env Fetch Error');
                throw new Error(response.statusText);
            }
            env = await response.json();
        } else {
            env = JSON.parse(localValue);
        }
        set(env);
        return env;
    }
}

export async function set(value: EnvConfig) {
    try {
        localEnv = Promise.resolve(value);
        const newValue = JSON.stringify(value);
        localStorage.setItem(localKey, newValue);
    } catch (err) {
        console.error('Env Update Error', err);
    }
}