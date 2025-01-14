import {createFieldSet, StringField} from '../fields';

export class ContactName implements Name {
    public readonly block: HTMLFieldSetElement;
    public readonly given: StringField;
    public readonly family: StringField;
    
    public constructor(base?: Name) {
        this.block = createFieldSet('Contact Name');

        this.given = new StringField({
            name: 'gnames',
            label: 'Given Names',
            value: base ? base.given.value : null
        });
        this.block.appendChild(this.given.block);

        this.family = new StringField({
            name: 'fname',
            label: 'Family Name',
            value: base ? base.family.value : null
        });
        this.block.appendChild(this.family.block);
    }

    public get full(): string {
        return `${this.given.value} ${this.family.value}`;
    }

    public get initials(): string {
        let initials = "";
        const names = this.given.value.split(" ").concat(this.family.value.split(" "));
        for (const name of names) {
            initials += name.slice(0,1);
        }
        return initials.toUpperCase();
    }
}