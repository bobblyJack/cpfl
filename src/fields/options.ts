export function createOption(data: FieldOptionData, match: boolean = false) {
    const value = data[0];
    const label = data[1];
    const element = document.createElement('option');
    element.value = value;
    element.textContent = label || (match ? value : "");
    return element;
}

export function createOptGroup(label: string, options: HTMLOptionElement[] = []) {
    const element = document.createElement('optgroup');
    element.label = label;
    options.map(option => element.appendChild(option));
    return element;
}