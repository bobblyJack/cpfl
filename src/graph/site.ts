import { getConfig } from "../config";

export async function getDrivePath() {
    const env = await getConfig();
    return `sites/${env.site.domain}:/sites/${env.site.name}:/drive`;
}