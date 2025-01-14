import * as html from '../fields';

export class ContactAddresses implements StreetAddresses {
    public readonly block: HTMLFieldSetElement;
    public readonly main: ContactAddress;
    public readonly splitter: html.BooleanField;
    private _post: ContactAddress | null = null;

    public constructor(base?: StreetAddresses) {
        this.block = html.createFieldSet('Contact Address');
        this.main = new ContactAddress(base?.main);
        this.block.appendChild(this.main.block);

        this.splitter = new html.BooleanField({
            name: "split",
            label: "Use Different Postal Address",
            value: base?.splitter.value || false
        });

        this.block.appendChild(this.splitter.block);
        
        if (this.splitter.value) {
            this._post = new ContactAddress(base?.post, true);
            this.block.appendChild(this._post.block);
        }
    }

    public startListening() {

    }

    public stopListening() {

    }

    
    
    

    
    public get post(): ContactAddress {
        if (this.splitter.value) {
            if (!this._post) {
                throw new Error('null postal address');
            }
            return this._post;
        }
        return this.main;
    }
    public set post(address: StreetAddress | null) {
        if (this.splitter.value) {
            if (!this._post) {
                this._post = new ContactAddress(address, true);
            }
            this.block.appendChild(this._post.block);
        } else if (!this.splitter.value) {
            if (this._post) {
                this._post.block.remove();
                this._post = null;
            }
        }
    }

}

class ContactAddress implements StreetAddress {
    public readonly block: HTMLFieldSetElement;
    public readonly location: html.StringField;
    public readonly street: html.StringField;
    public readonly suburb: html.StringField;
    public readonly state: html.SelectField<AusState> | html.StringField;
    public readonly postcode: html.StringField;
    public readonly country: html.StringField;
    
    public constructor(base: StreetAddress | null = null, post: boolean = false) {
        this.block = html.createFieldSet(post ? "Postal Address" : "Primary Address");

        this.location = new html.StringField({
            name: 'location',
            label: 'Location',
            value: base ? base.location.value : null
        });
        this.block.appendChild(this.location.block);

        this.street = new html.StringField({
            name: 'street',
            label: 'Street Address',
            value: base ? base.street.value : null
        });
        this.block.appendChild(this.street.block);
        
        const innerBlock = document.createElement('span');
        this.block.appendChild(innerBlock);

        this.suburb = new html.StringField({
            name: 'suburb',
            label: 'Suburb/City',
            value: base ? base.suburb.value : null
        });
        innerBlock.appendChild(this.street.block);
        
        if (base && base.country && base.country.value !== "Australia") {
            this.state = new html.StringField({
                name: 'state',
                label: 'State/Region',
                value: base.country.value
            });
        } else {
            this.state = this._stateAUS();
        }
        innerBlock.appendChild(this.state.block);

        this.postcode = new html.StringField({
            name: 'postcode',
            label: 'Postcode', 
            value: base ? base.postcode.value : null
        });
        innerBlock.appendChild(this.postcode.block);

        this.country = new html.StringField({
            name: 'country',
            label: 'Country (if not Australia)', 
            value: base ? base.country.value : null
        });
        this.block.appendChild(this.country.block);
    }

    private _stateAUS(def: AusState = "SA"): html.SelectField<AusState> {
        return new html.SelectField<AusState>({
            name: 'state',
            label: 'State/Territory',
            value: def,
            options: [
                ["SA"],
                ["VIC"],
                ["NSW"],
                ["QLD"],
                ["TAS"],
                ["WA"],
                ["NT"],
                ["ACT"]
            ]
        });
    }
}