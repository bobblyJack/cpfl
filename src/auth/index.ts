import { getMSAL } from './client';
import { getAuth } from './request';

/**
 * authenticated user
 * @wip cached config
 * @wip remote config
 * @wip configurable settings
 */
export class AuthUser implements UserConfig {

    public static debug: boolean = false;

    public static async login(): Promise<AuthUser> {
        const msal = await getMSAL(this.debug);
        const req = await getAuth({
            msalClient: msal
        });

        const user = req.account.idTokenClaims;
        if (!user) {
            throw new Error('user id undefined');
        }

        return new AuthUser(
            user["given_name"] as string,
            user["family_name"] as string,
            user.preferred_username || ""
        );
    }

    public static async logout() {
        const msal = await getMSAL(false);
        const activeAccount = msal.getActiveAccount();
        if (!activeAccount) {
            return;
        }
        return msal.clearCache({
            account: activeAccount
        });
    }

    private _gname: string;
    private _fname: string;
    public email: string;
    private constructor(gname: string, fname: string, email: string) {
        this._gname = gname;
        this._fname = fname;
        this.email = email;
    }

    public get id(): string {
        return this.email.slice(0, this.email.indexOf("@")).toUpperCase();
    }

    private get _fullname(): string {
        return `${this._gname} ${this._fname}`;
    }
    public get name() {
        return {
            given: this._gname,
            family: this._fname,
            full: this._fullname
        }
    }

    public get token() {
        return getMSAL(AuthUser.debug).then(async client => {
            const user = await getAuth({
                msalClient: client
            });
            return user.accessToken;
        });
    }

}