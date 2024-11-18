import CPFL from '..';
import { 
    PublicClientApplication 
} from '@azure/msal-browser';
import getMSAL from './client';
import getToken from './token';
import login from './login';
import logout from './logout';

/**
 * authenticated user
 * @wip cached config
 * @wip remote config
 * @wip configurable settings
 */
export class AuthUser {

    private static _MSAL: Promise<PublicClientApplication>;
    public static get MSAL() { // fetch ms auth library
        if (!this._MSAL || CPFL.debug) {
            this._MSAL = CPFL.env.then(env => {
                this._MSAL = getMSAL(env.id, env.tenant).then(pca => {
                    this._MSAL = Promise.resolve(pca);
                    return this._MSAL;
                });
                return this._MSAL;
            });
        }
        return this._MSAL;
    }

    public static async login() { // get id token claims
        const claims = await login(this.MSAL);
        return new AuthUser(claims);
    }

    public static async logout() { // clear ms auth cache
        return logout(this.MSAL);
    }

    public static async access(addedScopes: string[]) { // get access token
        const msal = await AuthUser.MSAL;
        const token = await getToken(msal, addedScopes);
        return token;
    }

    private gname: string;
    private fname: string;
    public email: string;
    private constructor(claims: Record<string, any>) {
        this.gname = claims['given_name'];
        this.fname = claims['family_name'];
        this.email = claims['email'];
    }

    public get id(): string {
        return this.email.slice(0, this.email.indexOf("@")).toUpperCase();
    }

    public get name() {
        return {
            given: this.gname,
            family: this.fname,
            full: `${this.gname} ${this.fname}`
        }
    }

    public get admin() {
        return this.id === 'LG'; // WIP: placeholder admin check
    }

    

}