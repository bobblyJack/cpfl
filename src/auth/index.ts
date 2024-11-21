import { 
    PublicClientApplication 
} from '@azure/msal-browser';
import fetchLocal from './local';
import initMSAL from './client';
import authReq from './req';
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

    /* ** dynamic config variables ** */
    private static _user: AuthUser | null = null;
    private static _env: EnvConfig | null = null;
    private static _pca: PublicClientApplication | null = null;


    public static async login(debug: boolean = false) { // login user
        if (!this._user) {
            if (!this._env || debug) {
                this._env = await fetchLocal(this.localKey, this.localPath, debug);
            }
            if (!this._pca || debug) {
                this._pca = await initMSAL(this._env.id, this._env.tenant);
            }
            const res = await authReq(this._pca);
            this._user = new AuthUser(res.idTokenClaims);
        }
        return this._user;
    }

    public static get user() { // fetch current user
        if (!this._user) {
            throw new Error('no user context found');
        }
        return this._user;
    }

    private gname: string;
    private fname: string;
    public email: string;
    private constructor(claims: Record<string, any>) {
        this.gname = claims['given_name'];
        this.fname = claims['family_name'];
        this.email = claims['email'];
    }

    public get env() {
        if (!AuthUser._env) {
            throw new Error('null environment variables somehow');
        }
        return AuthUser._env;
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

    private async token() {
        const res = await authReq(this.msal);
        return res.accessToken;
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

    public drive = { // fetch stuff from ms graph

        item: async (id: string, select?: (keyof DriveItem)[]) => { // get a single drive item
            const url = await this.graph(id, select);
            return this.fetch<DriveItem>(url);
        },

        collection: async (id?: string) => { // get folder children
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