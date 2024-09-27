const env = process.env.NODE_ENV === 'development' ? 'development' : 'production';
export default {
    mode: env as 'development' | 'production',
    dev: env === 'development',
    site: new URL(`https://${
        env === 'development' 
        // dev host
        ? process.env.DEV_HOST
        // prod host 
        : process.env.PROD_HOST
    }`),
    client: process.env.CLIENT_ID as string,
    tenant: process.env.TENANT_ID as string,
    drive: process.env.DRIVE_ID as string
}