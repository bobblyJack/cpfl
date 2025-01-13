export { BooleanField } from "./boolean";
export { StringField } from "./string";
export { NumberField } from "./number";
export { DateField } from "./date";
export { SelectField } from "./select";

export function createFieldSet(legend: string) {
    const set = document.createElement('fieldset');
    const leg = document.createElement('legend');
    leg.textContent = legend;
    set.appendChild(leg);
    return set;
}

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