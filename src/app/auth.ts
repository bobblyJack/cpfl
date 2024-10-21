import {
    PublicClientApplication,
    InteractionRequiredAuthError
} from '@azure/msal-browser';

export class AuthClient {
    private static _client: AuthClient;
    public static async init(id: string, tenant: string) {
        if (!this._client) {
            await Office.onReady();
            const aca = new this(id, tenant);
            await aca.msal.initialize();
            this._client = aca;
        }
        return this._client;
    }

    private msal: PublicClientApplication;
    private _tenant: string;
    private _ready: boolean = false;
    private constructor(id: string, tenant: string) {
        this._tenant = tenant;
        this.msal = new PublicClientApplication({
            auth: {
                clientId: id,
                authority: `https://login.microsoftonline.com/${tenant}`
            },
            system: {
                loggerOptions: {
                    loggerCallback: (level, message, containsPii) => {
                        if (containsPii) {
                            return;
                        }
                        if (level <= 1) {
                            console.error(message);
                        } else {
                            console.log(message);
                        }
                    },
                },
            },
        });
        this.login().then(() => this._ready = true);
    }

    private async login() {
        try {
            return this.msal.ssoSilent({});
        } catch (err) {
            if (err instanceof InteractionRequiredAuthError) {
                return this.msal.loginPopup();
            }
            console.error('unknown login error');
            throw err;
        }
    }

    private get ready(): Promise<void> {
        return new Promise((resolve) => {
            if (this._ready) {
                resolve();
            } else {
                const timer = setInterval(() => {
                    if (this._ready) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 50);
            }
        });
    }

    private async request(reqScopes: string[] = []) {
        const permission = {
            scopes: [
                ...reqScopes
            ]
        }
        try {
            return this.msal.acquireTokenSilent(permission);
        } catch (err) {
            if (err instanceof InteractionRequiredAuthError) {
                return this.msal.acquireTokenPopup(permission);
            }
            console.error('acquisition request error');
            throw err;
        }
    }

    public get token() {
        return (async () => {
            await this.ready;
            const req = await this.request();
            return req.accessToken;
        })();
    }

    public get identity() {
        return (async () => {
            await this.ready;
            let account = this.msal.getActiveAccount();
            if (!account) {
                const accounts = this.msal.getAllAccounts({
                    tenantId: this._tenant
                });
                if (accounts.length === 1) {
                    account = accounts[0];
                } else {
                    // WIP: pop up account selection
                    // using Office.context.ui.displayDialogAsync()
                }
            }
            if (!account || !account.idTokenClaims) {
                throw new Error('account id needs a hint')
            }
            return account.idTokenClaims;
        })();
    }

        
}