import { getEnv } from "../env";

export async function getDrivePath() {
    const env = await getEnv(false);
    return `sites/${env.site.domain}:/sites/${env.site.name}:/drive`;
}