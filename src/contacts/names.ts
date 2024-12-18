export class ContactName implements Name {
    public readonly block: HTMLDivElement;
    private _gnames: HTMLInputElement;
    private _fname: HTMLInputElement;
    public constructor(base?: Name) {
        this.block = document.createElement('div');

        this._gnames = this._textField('Given Names', base?.given.trim());
        this.block.appendChild(this._gnames);

        this._fname = this._textField('Family Name', base?.family.trim());
        this.block.appendChild(this._fname);
    }

    private _textField(ph: string = "...", init?: string) {
        const e = document.createElement('input');
        e.type = "text";
        e.placeholder = ph;
        if (init) {
            e.value = init;
        }
        return e;
    }

    public get given(): string {
        return this._gnames.value;
    }

    public get family(): string {
        return this._fname.value;
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