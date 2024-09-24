class Env {

    /*
     * environment variables 
     */
    private _mode = 'development';
    private _port = 3000;
    private _host = "clarkpanagakos.sharepoint.com/taskpane";
    private _client = "8ca8fd63-8fd6-4414-92e4-21584ed8df0f";
    private _tenant = "e72b34cf-ef52-473c-816a-e1d7d416dcc4";
    private _keys = "https://login.microsoftonline.com/common/discovery/v2.0/keys";
    private _scope = '/access_as_user';
    private _drive = 'b!sZigh2uhLkm81En6bkEH0c-dYK-8B61EljQC5ygtekif7QwnUqswTLKnsBFEkAKV';

    /*
     * environment parsing methods
     */
    
    public get mode(): 'production' | 'development' {
        if (this._mode === 'production') {
            return 'production';
        }
        return 'development';
    }

    public get dev(): boolean {
        return this.mode === 'development';
    }

    public get port(): number {
        return this._port;
    }

    private get _domain(): string {
        if (this.dev) {
            return `localhost:${this.port}`;
        }
        return this._host;
    }

    public get domain(): string {
        return `https://${this._domain}`;
    }

    public get client(): string {
        return this._client;
    }

    public get tenant(): string {
        return this._tenant;
    }
    
    public get keys(): string {
        return this._keys;
    }

    public get api(): string {
        return `api://${this._domain}/${this.client}`;
    }

    public get scope(): string {
        return this.api + this._scope;
    }

    public get drive(): string {
        return this._drive;
    }

}

export default new Env();