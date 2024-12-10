import { UserObject } from './base';
import * as MSAL from '../msal';

const configName: GraphURLFragment = ":/config.json";

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
        try {
            const auth = await MSAL.get();
            const claims = auth.idTokenClaims as Record<string, string>;
            console.log('user id claimed', claims);
            const obj = await UserObject.set(configName);
            const initConfig: UserConfig = {
                name: {
                    given: claims["given_name"],
                    family: claims["family_name"]
                },
                email: claims["email"],
                theme: "light",
                admin: claims["given_name"] === "Lucas" //placeholder
            };
            const existingConfig = await obj.config;
            const config = {
                ...initConfig,
                ...existingConfig ? existingConfig : {}
            }
            obj.config = config;
            this._current = new this(obj.id, config);
        } catch (err) {
            console.error('user login error', err);
        }
        return this.current;
    }

    name: Name;
    email: string;
    theme: AppTheme;
    readonly admin: boolean;
    protected constructor(protected readonly key: string, base: UserConfig) {
        this.name = base.name;
        this.email = base.email;
        this.theme = base.theme;
        this.admin = base.admin;
    }

    protected async _save() {
        const obj = await UserObject.get(this.key);
        obj.config = this;
    }

    /**
     * auth user logout WIP
     */
    public async logout() {
        setTimeout(() => { 
            MSAL.set().then((msal) => {
                msal.logoutPopup().then(() => {
                    AppUser._current = null;
                });
            });
        }, 5000);
    }
}

