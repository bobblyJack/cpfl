import env from '../env';
import jwt from 'jsonwebtoken';
import { JwksClient } from "jwks-rsa";

const tenancy = `https://login.microsoftonline.com/${env.tenant}`;
const keyFetcher = new JwksClient({
    jwksUri: `${tenancy}/discovery/v2.0/keys`
});

/**
 * Passes Signing Key to JWT Verification
 * @param header decoded auth token header
 * @param pass verification callback function
 */
async function passSigKey(header: jwt.JwtHeader, pass: jwt.SigningKeyCallback) {
    if (!header.kid) {
        pass(new Error('key id missing'));
    } else {
        const key = await keyFetcher.getSigningKey(header.kid);
        pass(null, key.getPublicKey());
    }
}

/**
 * Token Verification
 * @param token auth token to verify against client id
 * @returns json web token payload
 */
export async function verifyToken(token: string) {

    return new Promise<jwt.JwtPayload>((resolve, reject) => {

        jwt.verify(token, passSigKey, {
            audience: env.client,
            issuer: `${tenancy}/v2.0`
        }, (err, result) => {
            if (err) {
                return reject(err);
            }
            if (!result) {
                return reject(new Error('token undefined'));
            }
            if (typeof result === 'string') {
                return reject(new Error(result));
            }
            return resolve(result);
        });

    });
    
}