import { 
    PublicClientApplication 
} from '@azure/msal-browser';
import localEnv from './local';
import initMSAL from './client';
import authReq from './req';
import authFetch from './fetch';
import getDrive from './items';
import getFileContent from './content';

/**
 * authenticated user context
 * @wip remote cached config
 * @wip configurable settings
 */
export class AuthUser {

    private static _user: AuthUser | null = null;
    private static _env: EnvConfig | null = null;
    private static _pca: PublicClientApplication | null = null;

    public static get current() {
        if (!this._user) {
            throw new Error('no user logged in');
        }
        return this._user;
    }

    public static async login(debug: boolean = false) { // login user
        if (!this._user) {
            if (!this._env || debug) {
                this._env = await localEnv.get(debug);
            }
            if (!this._pca || debug) {
                this._pca = await initMSAL(this._env.id, this._env.tenant);
            }
            const res = await authReq(this._pca);
            this._user = new AuthUser(res.idTokenClaims);
        }
        return this._user;
    }

    private gnames: string;
    private fname: string;
    public email: string;
    private constructor(claims: Record<string, any>) {
        this.gnames = claims['given_name'];
        this.fname = claims['family_name'];
        this.email = claims['email'];
    }

    public get env() {
        if (!AuthUser._env) {
            throw new Error('null environment variables somehow');
        }
        return AuthUser._env;
    }

    public async sync() { // WIP: update local
        localEnv.set(this.env);
    }

    public get msal() {
        if (!AuthUser._pca) {
            throw new Error('msal not instanced')
        }
        return AuthUser._pca;
    }

    public async logout() { // WIP: logout
        await this.msal.logoutPopup();
        AuthUser._user = null;
    }

    public get id(): string { // WIP: placeholder user id
        return this.email.slice(0, this.email.indexOf("@")).toUpperCase();
    }

    public get name() { // TBD: proper name interface
        return {
            given: this.gnames,
            family: this.fname,
            full: `${this.gnames} ${this.fname}`
        }
    }

    public get admin() {
        return this.id === 'LG'; // WIP: placeholder admin check
    }

    private async token() { // get access token
        const res = await authReq(this.msal);
        return res.accessToken;
    }

    public async fetch<T>(url: string | URL) { // fetch w token
        const token = await this.token();
        return authFetch<T>(token, url);
    }

    public readonly drive = { // get ms drive stuff
        // TBD: consolidate id/path to single method.
        byID: getDrive.itemID,
        byPath: getDrive.itemPath,
        collectID: getDrive.collectID,
        collectPath: getDrive.collectPath,
        content: getFileContent
    }

}