import { getConfig } from "../env";

export async function getDrivePath() {
    const env = await getConfig();
    return `sites/${env.site.domain}:/sites/${env.site.name}:/drive`;
}