export default async function fetchLocal(localKey: string, localPath: string) {

    let localValue = localStorage.getItem(localKey);

    if (!localValue) {

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