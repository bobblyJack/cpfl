export class ContactAddresses implements StreetAddresses {
    public readonly main: ContactAddress;
    public readonly block: HTMLDivElement;

    public constructor(base?: StreetAddresses) {
        this.block = document.createElement('div');

        this.main = new ContactAddress(base?.main);
        this.block.appendChild(this.main.block);

        if (base?.split) {
            this._post = new ContactAddress(base?.post, true);
        }

        const splitterLabel = document.createElement('label');
        splitterLabel.innerText = "Use Different Postal Address";
        splitterLabel.appendChild(this.splitter);

        if (this._post) {
            this.block.appendChild(this._post.block);
        }
    }

    private _splitter?: HTMLInputElement;
    private get splitter(): HTMLInputElement {
        if (!this._splitter) {
            const set = this;
            this._splitter = document.createElement('input');
            this._splitter.type = "checkbox";
            this._splitter.checked = this._post !== null;
            this._splitter.onchange = () => {
                set.post = null;
            };
        }
        return this._splitter;
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
    public readonly block: HTMLLabelElement;
    private _location: HTMLInputElement;
    private _street: HTMLInputElement;
    private _suburb: HTMLInputElement;
    private _state: HTMLSelectElement | HTMLInputElement;
    private _postcode: HTMLInputElement;
    private _country: HTMLInputElement;
    
    public constructor(base: StreetAddress | null = null, post: boolean = false) {
        this.block = document.createElement('label');
        this.block.innerText = post ? "Postal Address" : "Primary Address";
        this._location = this._textInput('Location');
        this.block.appendChild(this._location);
        
        this._street = this._textInput('Street Address');
        this.block.appendChild(this._street);
        
        const innerBlock = document.createElement('span');
        
            this._suburb = this._textInput('Suburb/City');
            innerBlock.appendChild(this._suburb);

            if (base && base.country && base.country !== "Australia") {
                this._state = this._textInput('State/Region');
                this._state.name = 'state';
            } else {
                this._state = this._stateAUS();
            }
            innerBlock.appendChild(this._state);

            this._postcode = this._textInput('Postcode');
            innerBlock.appendChild(this._postcode);
            
        this.block.appendChild(innerBlock);

        this._country = this._textInput('Country (if not Australia)');
        this._country.oninput = () => {
            let newState: HTMLInputElement | HTMLSelectElement;
            if (!this._country.value || this._country.value.toLowerCase() === "australia") {
                newState = this._stateAUS();
                this._postcode.pattern = "\\d{4}";
                this._postcode.title = "4 Digit Postcode";

            } else {
                newState = this._textInput('State/Region');
                newState.name = 'state';
                this._postcode.pattern = "";
                this._postcode.title = "";
            }

            this._state.replaceWith(newState);
            this._state = newState;
        }
        this.block.appendChild(this._country);

        if (base) {
            this._location.value = base.location || "";
            this._street.value = base.street;
            this._suburb.value = base.suburb;
            this._state.value = base.state;
            this._postcode.value = base.postcode;
            this._country.value = base.country || "";
        }

    }

    private _textInput(ph: string = "...") {
        const e = document.createElement('input');
        e.type = "text";
        e.placeholder = ph;
        return e;
    }

    private _stateAUS(def: AusState = "SA") {
        const ausSelect = document.createElement('select');
        ausSelect.name = "state";
        for (const state of ausStates) {
            const option = document.createElement('option');
            option.value = state;
            option.innerText = state;
            if (state === def) {
                option.selected = true;
            }
            ausSelect.appendChild(option);
        }
        return ausSelect;
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
        if (element instanceof HTMLInputElement) {
            element.oninput = action;
        } else {
            element.onchange = action;
        }
    }

    public ignore(field: keyof StreetAddress) {
        const element = this._mapField(field);
        if (element instanceof HTMLInputElement) {
            element.oninput = null;
        } else {
            element.onchange = null;
        }
    }

}