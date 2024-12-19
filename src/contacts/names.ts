import * as Fields from '../fields';

export class ContactName implements Name {
    public readonly block: HTMLFieldSetElement;
    private _gnames: Fields.InputField;
    private _fname: Fields.InputField;
    public constructor(base?: Name) {
        this.block = Fields.createFieldSet('Contact Name');

        this._gnames = new Fields.InputField('Given Names');
        this._fname = new Fields.InputField('Family Name');

        if (base) {
            this._gnames.value = base.given.trim();
            this._fname.value = base.family.trim();
        }

        this.block.appendChild(this._gnames.block);
        this.block.appendChild(this._fname.block);
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