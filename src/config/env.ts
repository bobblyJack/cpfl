export async function fetchEnv(path: string) {
    
    const response = await fetch(path);

    if (!response.ok) {
        console.error('Env Fetch Error');
        throw new Error(response.statusText);
    }

    return response.json() as Promise<EnvConfig>;

}