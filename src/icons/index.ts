import 'iconify-icon';
import './iconify.css';

const iconSet: string = "carbon";

export function createIcon(name: string, set: string = iconSet) {
    const element = document.createElement("iconify-icon");
    element.icon = `${set}:${name}`;
    return element;
}