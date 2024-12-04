export class ContactAddresses implements StreetAddresses {
    public main: ContactAddress;
    private _post: ContactAddress | null;

    public constructor(base?: StreetAddresses) {
        this.main = new ContactAddress(base?.main);
        if (!base || !base.post) {
            this._post = null;
        } else {
            this._post = new ContactAddress(base.post);
        }
    }

    public get post(): ContactAddress {
        if (this._post) {
            return this._post;
        }
        return this.main;
    }
    public set post(address: StreetAddress | null) {
        if (address) {
            this._post = new ContactAddress(address);
        } else {
            this._post = null;
        }
    }

}

class ContactAddress implements StreetAddress {
    public location: string;
    public street: string;
    public state: string;
    public suburb: string;
    public postcode: string;
    public country: string;
    public constructor(base?: StreetAddress) {
        this.location = base?.location || "";
        this.street = base?.street || "";
        this.suburb = base?.suburb || "";
        this.state = base?.state || "";
        this.postcode = base?.postcode || "";
        this.country = base?.country || "";
    }
}