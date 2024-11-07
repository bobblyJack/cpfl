import 'iconify-icon';

const iconifySet = "carbon";
export function createIconifyIcon(name: string, prefix: string = iconifySet) {
    
    const element = document.createElement("iconify-icon");
    element.icon = `${prefix}:${name}`;
    element.noobserver = true;
    
    if (!element.iconLoaded(element.icon)) {
        element.loadIcon(element.icon).catch(console.error);
    }

    return element;
    
}