import { 
    PublicClientApplication 
} from '@azure/msal-browser';
import fetchLocal from './local';
import initMSAL from './client';
import getIdentity from './identity';
import getToken from './token';
import formURL from './url';
import authFetch from './fetch';
import readBlob64 from './blob';

/**
 * authenticated user context
 * @wip remote cached config
 * @wip configurable settings
 */
export class AuthUser {

    /* ** static config variables ** */
    private static localKey: string = 'cpfl-env';
    private static localPath: string = './config.json';
    private static graphOrigin: string = "https://graph.microsoft.com";
    private static graphVersion: string = "v1.0";

    private static _user: AuthUser | null = null;
    public static async login() { // login user
        if (!this._user) {
            const env = await fetchLocal(this.localKey, this.localPath);
            const msal = await initMSAL(env.id, env.tenant);
            const claims = await getIdentity(msal);
            this._user = new AuthUser(env, msal, claims);
        }
        return this._user;
    }
    public static get user() { // fetch current user
        if (!this._user) {
            throw new Error('no user context found');
        }
        return this._user;
    }

    public static async logout(fullRefresh: boolean = false) { // clear auth cache
        if (this._user) {
            console.log('clearing msal cache')
            const account = this._user.msal.getActiveAccount();
            if (account) {
                await this._user.msal.clearCache({
                    account: account
                });
            }
            this._user = null;
            if (fullRefresh) {
                localStorage.removeItem(this.localKey);
            }
        }
    }

    public env: EnvConfig;
    public readonly msal: PublicClientApplication;

    private gname: string;
    private fname: string;
    public email: string;
    private constructor(env: EnvConfig, client: PublicClientApplication, claims: Record<string, any>) {
        this.msal = client;
        this.env = env;
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

    private async token(scopes: string[] = []) {
        return getToken(this.msal, scopes);
    }

    public async fetch<T>(url: string | URL) { // fetch w token
        const token = await this.token();
        return authFetch<T>(token, url);
    }

    private async graph(id?: string, query?: (keyof DriveItem | "children")[]) { // get graph url
        if (!this.env.site.id) { // fetch site id first if undefined
            const sitePath = `sites/${this.env.site.domain}:/sites/${this.env.site.name}`;
            const siteURL = formURL(AuthUser.graphOrigin, AuthUser.graphVersion, sitePath, ["id"]);
            const res = await this.fetch<Record<string, string>>(siteURL);
            this.env.site.id = res["id"];
        }
        let path = `sites/${this.env.site.id}/drive/`;
        if (id) {
            path += `items/${id}`; // get a specific thing
        } else {
            path += "root"; // or just the root folder
        }
        let select: (keyof DriveItem)[] = [];
        if (query && query.length) {
            if (query.includes("children")) {
                path += "/children"; // return a collection
            }
            select = query.filter(q => q !== "children");
        }
        return formURL(AuthUser.graphOrigin, AuthUser.graphVersion, path, select);
    }

    public drive = {
        item: async (id: string, select?: (keyof DriveItem)[]) => { // get a single drive item
            const url = await this.graph(id, select);
            return this.fetch<DriveItem>(url);
        },

        collection: async (id?: string) => { // get folder content
            const url = await this.graph(id, [
                "id", "name", "file", "folder", "children"
            ]);
            return getItems(this, url);
            async function getItems(user: AuthUser, url: string | URL, values: DriveItem[] = []) {
                const response = await user.fetch<ItemCollection>(url);
                for (const item of response.value) {
                    values.push(item);
                }
                if (response["@odata.nextLink"]) {
                    return getItems(user, response["@odata.nextLink"], values);
                }
                return values;
            }
        },

        content: async (id: string) => { // get file content
            try {
                const item = await this.drive.item(id);
                const url = item["@microsoft.graph.downloadUrl"];
                if (!url) {
                    throw new Error('download link missing');
                }
                const response = await fetch(url);
                if (!response.ok) {
                    console.error(response.status, response.statusText);
                    throw new Error('download link not ok');
                }
                const blob = await response.blob();
                return readBlob64(blob);

            } catch (err) {
                console.error(err, id);
                return "";
            }
        }
    }

}