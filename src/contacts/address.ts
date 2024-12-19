import * as Fields from '../fields';

export class ContactAddresses implements StreetAddresses {
    public readonly block: HTMLFieldSetElement;
    public readonly main: ContactAddress;
    public readonly splitter: Fields.InputField;

    public constructor(base?: StreetAddresses) {
        this.block = Fields.createFieldSet('Contact Address');
        this.main = new ContactAddress(base?.main);
        this.block.appendChild(this.main.block);
        this.splitter = new Fields.InputField('Use Different Postal Address', {
            inputType: "checkbox",
            specifiedName: "split"
        });

        if (base?.split) {
            this._post = new ContactAddress(base?.post, true);
        }

        this.splitter.checked = this._post !== null;
        this.splitter.onchange = () => {
            console.log('splitter change detected', this);
            this.post = null;
        }
        this.block.appendChild(this.splitter.block);

        if (this._post) {
            this.block.appendChild(this._post.block);
        }
    }

    
    public get split(): boolean {
        return this.splitter.checked;
    }

    private _post: ContactAddress | null = null;
    public get post(): ContactAddress {
        if (this.split) {
            if (!this._post) {
                throw new Error('null postal address');
            }
            return this._post;
        }
        return this.main;
    }
    public set post(address: StreetAddress | null) {
        if (this.split) {
            if (!this._post) {
                this._post = new ContactAddress(address, true);
            }
            this.block.appendChild(this._post.block);
        } else if (!this.split) {
            if (this._post) {
                this._post.block.remove();
                this._post = null;
            }
        }
    }

}

const ausStates: AusState[] = ["SA", "VIC", "NSW", "QLD", "TAS", "WA", "NT", "ACT"]

class ContactAddress implements StreetAddress {
    public readonly block: HTMLFieldSetElement;
    private _location: Fields.InputField;
    private _street: Fields.InputField;
    private _suburb: Fields.InputField;
    private _state: Fields.DropField | Fields.InputField;
    private _postcode: Fields.InputField;
    private _country: Fields.InputField;
    
    public constructor(base: StreetAddress | null = null, post: boolean = false) {
        this.block = Fields.createFieldSet(post ? "Postal Address" : "Primary Address");

        this._location = new Fields.InputField('Location', {
            specifiedName: 'location'
        });
        this.block.appendChild(this._location.block);
        
        this._street = new Fields.InputField('Street Address', {
            specifiedName: 'street'
        });
        this.block.appendChild(this._street.block);
        
        const innerBlock = document.createElement('span');
        
            this._suburb = new Fields.InputField('Suburb/City', {
                specifiedName: 'suburb'
            });
            innerBlock.appendChild(this._suburb.block);

            if (base && base.country && base.country !== "Australia") {
                this._state = new Fields.InputField('State/Region', {
                    specifiedName: 'state'
                });
            } else {
                this._state = this._stateAUS();
            }
            innerBlock.appendChild(this._state.block);

            this._postcode = new Fields.InputField('Postcode', {
                specifiedName: 'postcode'
            });
            innerBlock.appendChild(this._postcode.block);
            
        this.block.appendChild(innerBlock);

        this._country = new Fields.InputField('Country (if not Australia)', {
            specifiedName: 'country'
        });
        this._country.onchange = () => {
            let newState: Fields.DropField | Fields.InputField;
            if (!this._country.value || this._country.value.toLowerCase() === "australia") {
                newState = this._stateAUS();
                this._postcode.pattern = "\\d{4}";
                this._postcode.title = "4 Digit Postcode";

            } else {
                newState = new Fields.InputField('State/Region', {
                    specifiedName: 'state'
                });
                this._postcode.pattern = "";
                this._postcode.title = "";
            }

            this._state.block.replaceWith(newState.block);
            this._state = newState;
        }
        this.block.appendChild(this._country.block);

        if (base) {
            this._location.value = base.location || "";
            this._street.value = base.street;
            this._suburb.value = base.suburb;
            this._state.value = base.state;
            this._postcode.value = base.postcode;
            this._country.value = base.country || "";
        }

    }

    private _stateAUS(def: AusState = "SA"): Fields.DropField {
        return new Fields.DropField('State/Territory', {
            specifiedName: 'state',
            matchedLabels: true,
            optionsList: ausStates.map(state => [state]),
            selectedIndex: ausStates.indexOf(def)
        });
    }

    public get location(): string {
        return this._location.value;
    }
    public get street(): string {
        return this._street.value;
    }
    public get suburb(): string {
        return this._suburb.value;
    }
    public get state(): string {
        return this._state.value;
    }
    public get postcode(): string {
        return this._postcode.value;
    }
    public get country(): string {
        return this._country.value;
    }

    private _mapField(field: keyof StreetAddress) {
        switch (field) {
            case "location": return this._location;
            case "street": return this._street;
            case "suburb": return this._suburb;
            case "state": return this._state;
            case "postcode": return this._postcode;
            case "country": return this._country;
        }
    }

    public watch(field: keyof StreetAddress, action: (ev: Event) => any) {
        const element = this._mapField(field);
        element.onchange = action;
        
    }

    public ignore(field: keyof StreetAddress) {
        const element = this._mapField(field);
        element.onchange = null;
    }

}