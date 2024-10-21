import { AuthClient } from "./auth";

export class AppUser {
    private _gname: string;
    private _fname: string;
    private _email: string;
    private constructor(gname: string, fname: string, email: string) {
        this._gname = gname;
        this._fname = fname;
        this._email = email;
    }

    private static _id: AppUser;
    public static async login(auth: AuthClient, refresh: boolean = false) {
        if (!this._id || refresh) {
            const id = await auth.identity;
            this._id = new this(
                id['given_name'] as string,
                id['family_name'] as string,
                id.preferred_username || ""
            );
        }
        return this._id;
    }

    public get name() {
        return {
            given: this._gname,
            family: this._fname,
            full: `${this._gname} ${this._fname}`
        }
    }

    public get email() {
        return this._email;
    }
    public get id() {
        return this._email.slice(0, this._email.indexOf("@")).toUpperCase();
    }
}