import { StringField } from './string';

interface SelectData<T extends string> extends FieldData<T> {
    type: FieldInputTypeSelect;

}

// create dummy null option for select fields "...";

export class SelectField<T extends string> extends StringField {
    protected _field!: HTMLSelectElement;
    public constructor(data: SelectData<T>) {
        super(data);
    }

    protected _init(type: FieldInputTypeSelect) {
        const field = document.createElement('select');
        if (type === 'select-multiple') {
            field.multiple = true;
        }
        return field;
    }

    protected get _options(): HTMLOptionsCollection {
        return this._field.options;
    }

    public get selection(): number {
        return this._options.selectedIndex;
    }
    public set selection(i: number) {
        this._options.selectedIndex = i;
    }
    
}