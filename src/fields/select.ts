import * as opts from './options';

export class DropField {
    private static _defaults: DropFieldParams = {
        labelPosition: "before",
        matchedLabels: false
    }

    private _block: HTMLLabelElement = document.createElement('label');
    private _label: HTMLSpanElement = document.createElement('span');
    private _select: HTMLSelectElement = document.createElement('select');

    public constructor(label: string, options?: Partial<DropFieldParams>) {
        const params: DropFieldParams = {
            ...DropField._defaults,
            ...options
        }

        this._label.textContent = label;
        this._block.appendChild(this._label);

        if (params.labelPosition === "above") {
            this._block.innerHTML += "<br>";
        }

        this._select.name = params.specifiedName ? params.specifiedName : label.replace(/ /g, "");
        this._block.appendChild(this._select);

        if (params.optionsList) {
            for (const option of params.optionsList) {
                const e = this.create(option, params.matchedLabels);
                this.add(e);
            }
        }

        if (params.selectedIndex !== undefined) {
            this.selection = params.selectedIndex;
        }
    }

    public get block() {
        return this._block;
    }

    private get _options() {
        return this._select.options;
    }

    public create(option: FieldOptionData, matchLV: boolean = false) {
        return opts.createOption(option, matchLV);
    }

    public add(
        option: HTMLOptionElement | HTMLOptGroupElement, 
        before?: HTMLOptionElement | number | null
    ) {
        this._options.add(option, before);
    }

    public get selection(): number {
        return this._options.selectedIndex;
    }
    public set selection(i: number) {
        this._options.selectedIndex = i;
    }

    public get value(): string {
        return this._select.value;
    }
    public set value(value: string) {
        this._select.value = value;
    }

    public remove(i: number) {
        this._options.remove(i);
    }

    public get onchange() {
        return this._select.onchange;
    }
    public set onchange(action: ((ev: Event) => any) | null) {
        this._select.onchange = action;
    }

    public group(label: string, group: (FieldOptionData | HTMLOptionElement)[]) {
        const options: HTMLOptionElement[] = [];
        for (const option of group) {
            if (option instanceof HTMLOptionElement) {
                options.push(option);
            } else {
                options.push(opts.createOption(option));
            }
        }
        return opts.createOptGroup(label, options);
    }

}