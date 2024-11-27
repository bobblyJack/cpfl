const localKey: string = 'cpfl-env';
const localPath: string = './config.json';
let localEnv: EnvConfig;

export async function get(refresh: boolean = false) {
    if (!localEnv || refresh) {
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
        localEnv = await JSON.parse(localValue) as EnvConfig;
        }
    return localEnv;
}

export async function set(value: EnvConfig) {
    try {
        localEnv = value;
        const newValue = JSON.stringify(value);
        localStorage.setItem(localKey, newValue);
    } catch (err) {
        console.error('Env Update Error', err);
    }
}