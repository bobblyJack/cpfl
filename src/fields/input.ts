import setUniqueID from './id';

/*
input element attributes:
accept "{file_extension/media_type}" for type=file
autocomplete "on" "off"
autofocus BOOL
checked BOOL
disabled BOOL
list "datalist_id" to set datalist options
min / max / step "number / date"
minlength / maxlength "number"
multiple BOOL
name "text" (submission key)
pattern "regex"
placeholder "text"
readonly BOOL
required BOOL
size "number"
value "text" (submission value)
*/

// type HTMLInputBooleanAttribute = "checked" | "disabled" | "multiple" | "readonly" | "required"

/**
 * dynamic input element with label wrapper
 */
export class InputField {
    private static _defaults: InputFieldParams = {
        inputType: "text",
        labelPosition: "before",
        insertBreak: false,
    }

    private _block: HTMLLabelElement = document.createElement('label');
    private _label: HTMLSpanElement = document.createElement('span');
    private _input: HTMLInputElement = document.createElement('input');
    private _list?: HTMLDataListElement;
    public constructor(label: string, options?: Partial<InputFieldParams> | HTMLInputType) {
        if (typeof options === 'string') {
            options = {inputType: options};
        } else if (!options) {
            options = {};
        }

        let params: InputFieldParams = InputField._defaults // get defaults
        switch (params.inputType) {
            case "checkbox":
            case "radio":
                params.labelPosition = "after";
        }

        if (options.labelPosition === "placeholder") {
            this._input.placeholder = label;
            options.labelPosition = undefined;
        } else {
            this._label.innerText = label;
        }
        
        params = { // set mode
            ...params,
            ...options
        }

        this._input.type = params.inputType;
        this._input.name = params.specifiedName ? params.specifiedName : label.replace(/ /g, "");

        // block structure
        this._block.appendChild(params.labelPosition === 'before' ? this._label : this._input);
        this._block.innerHTML += params.insertBreak ? '<br>' : "";
        this._block.appendChild(params.labelPosition === 'before' ? this._input : this._label);

        if (["text", "search", "email", "tel", "url"].includes(this.type)) { // add datalist
            if (params.dataList && params.dataList.length) {
                this._list = document.createElement('datalist');
                setUniqueID(this._list, `${this._input.name}-datalist`);
                this._input.setAttribute('list', this._list.id);
                for (const option of params.dataList) {
                    const dataOption = document.createElement('option');
                    dataOption.value = option;
                    this._list.appendChild(dataOption);
                }
                this._block.appendChild(this._list);
            }
        }

    }

    public get type(): HTMLInputType {
        return this._input.type as HTMLInputType;
    }

    public get block(): HTMLLabelElement {
        return this._block;
    }

    public get label(): string {
        return this._label.innerText;
    }
    public set label(label: string) {
        this._label.innerText = label;
    }

    public get placeholder(): string {
        return this._input.placeholder;
    }
    public set placeholder(text: string) {
        this._input.placeholder = text;
    }

    public get value(): string {
        return this._input.value;
    }
    public set value(value: string) {
        this._input.value = value;
    }

    public get checked(): boolean {
        if (this.type === "checkbox" || this.type === "radio") {
            return this._input.checked;
        } else {
            return false;
        }
    }
    public set checked(checked: boolean) {
        if (this.type === 'checkbox' || this.type === 'radio') {
            this._input.checked = checked;
        }
    }

    public set pattern(pattern: string) { // WIP
        this._input.pattern = pattern;
    }

    public set title(title: string) { // WIP
        this._input.title = title;
    }

    public get onchange() {
        return this._input.onchange;
    }
    public set onchange(action: ((ev: Event) => any) | null) {
        this._input.onchange = action;
    }

}