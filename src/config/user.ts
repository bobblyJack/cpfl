import auth from '../auth';

export async function fetchUser(env: EnvConfig): Promise<UserConfig> {
    const req = await auth.get({
        msalClient: await auth.init(env)
    });

    const user = req.account.idTokenClaims;
    if (!user) {
        throw new Error('user id undefined');
    }

    const gname = user["given_name"] as string;
    const fname = user["family_name"] as string;
    const email = user.preferred_username || "";

    return new AppUser(gname, fname, email);
}

class AppUser implements UserConfig {

    private _gname: string;
    private _fname: string;
    private _email: string;
    public constructor(gname: string, fname: string, email: string) {
        this._gname = gname;
        this._fname = fname;
        this._email = email;
    }

    public get email(): string {
        return this._email;
    }
    public get id(): string {
        return this.email.slice(0, this.email.indexOf("@")).toUpperCase();
    }
    public get name() {
        return {
            given: this._gname,
            family: this._fname,
            full: `${this._gname} ${this._fname}`
        }
    }
 
}