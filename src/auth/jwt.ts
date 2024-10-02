import {
    jwtVerify, 
    JWTVerifyOptions,
    createRemoteJWKSet
} from 'jose';
import env from '../env';

const tenancy = `https://login.microsoftonline.com/${env.tenant}`;
const JWKS = createRemoteJWKSet(new URL(`${tenancy}/discovery/v2.0/keys`));

const options: JWTVerifyOptions = {
    audience: env.client,
    issuer: `${tenancy}/v2.0`
}

export async function verifyJWT(token: string) {
    const response = await jwtVerify(token, JWKS, options);
    return response.payload;
}