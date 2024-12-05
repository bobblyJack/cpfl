import CPFL from "..";
import readBlob64 from "./blob";
import * as content from "./content";

export async function get(): Promise<UserConfig> {
    const blob = await content.downloadContent(':/config.json', 'user');
    const text = await readBlob64(blob);
    return JSON.parse(text);
}

export async function set(config: UserConfig) {
    try {
        const text = JSON.stringify(config);
        content.uploadContent(text, 'config.json', 'user');
    } catch (err) {
        CPFL.app.debug.err(err);
    }   
}