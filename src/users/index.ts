import * as MSAL from '../msal';
import { userConfig } from "../graph/archive";

export class AppUser implements UserConfig {

    private static _current: AppUser | null = null;
    public static get current(): AppUser {
        if (!this._current) {
            throw new Error('null current user');
        }
        return this._current;
    }

    /**
     * auth user init WIP
     * @tbd make user of login_hint
     */
    public static async login() {
        let config: UserConfig;
        try {
            config = await userConfig.get();
        } catch (err) {
            console.log('logging on new user');
            const auth = await MSAL.get();
            const claims = auth.idTokenClaims as Record<string, string>;
            config = {
                name: {
                    given: claims["given_name"],
                    family: claims["family_name"]
                },
                email: claims["email"],
                theme: "light",
                admin: claims["given_name"] === "Lucas" //placeholder
            }
            userConfig.set(config);
            console.log('WIP: change admin check', claims); // WIP
        }
        this._current = new AppUser(config);
        return this._current;
    }

    public name: Name;
    public email: string;
    public theme: AppTheme;
    public readonly admin: boolean;
    public constructor(base: UserConfig) {
        this.name = base.name;
        this.email = base.email;
        this.theme = base.theme;
        this.admin = base.admin;
    }

    /**
     * auth user logout WIP
     */
    public async logout() {
        const msal = await MSAL.set();
        AppUser._current = null;
        return msal.logoutPopup;
    }
}

