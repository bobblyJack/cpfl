import {IconifyIconHTMLElement} from 'iconify-icon';

const prefixDefault: string = "carbon";
const loadedIcons: string[] = [];

export function createIconifyIcon(name: string, prefix: string = prefixDefault, constant: boolean = true) {
    const icon = `${prefix}:${name}`;
    const element = document.createElement("iconify-icon");
    element.icon = icon;
    element.noobserver = constant;
    fetchIconifyIcon(element);
    return element;
}

async function fetchIconifyIcon(e: IconifyIconHTMLElement) {
    try {
        const name = e.icon as string;
        if (!loadedIcons.includes(name)) {
            await e.loadIcon(name);
            loadedIcons.push(name);
        }
    } catch (err) {
        console.error('error loading iconify icon', err);
    }
}

class IIcon {
    private static defaultSet: string = "carbon";
    public constructor(name: string, prefix: string = IIcon.defaultSet) {
        
    }
}