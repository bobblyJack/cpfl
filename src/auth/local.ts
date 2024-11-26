const localKey: string = 'cpfl-env';
const localPath: string = './config.json';

async function getLocal(refresh: boolean = false) {
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
    return JSON.parse(localValue) as EnvConfig;
}

async function setLocal(value: EnvConfig) {
    try {
        const newValue = JSON.stringify(value);
        localStorage.setItem(localKey, newValue);
    } catch (err) {
        console.error('Env Update Error', err);
    }
}

const localEnv = {
    get: getLocal,
    set: setLocal
}

export default localEnv;