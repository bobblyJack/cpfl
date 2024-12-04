export class ContactName implements Name {
    private _gnames: string;
    private _fname: string;
    public constructor(base?: Name) {
        this._gnames = base?.given.trim() || "";
        this._fname = base?.family.trim() || "";
    }

    public get given(): string {
        return this._gnames;
    }
    public set given(gnames: string) {
        if (gnames && gnames !== this._gnames) {
            this._gnames = gnames.trim();
        }
    }

    public get family(): string {
        return this._fname;
    }

    public set family(fname: string) {
        if (fname && fname !== this._fname) {
            this._fname = fname.trim();
        }
    }

    public get full(): string {
        return `${this.given} ${this.family}`;
    }

    public get initials(): string {
        let initials = "";
            const names = this.given.split(" ").concat(this.family.split(" "));
            for (const name of names) {
                initials += name.slice(0,1);
            }
            return initials.toUpperCase();

    }
}