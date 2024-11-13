import 'iconify-icon';

const iconifySet = "carbon";
/**
 * create iconify icon html element
 * @param name icon string name
 * @param prefix overwrite default iconify set
 * @wip return a default error icon if name invalid
 */
export function createIconifyIcon(name: string, prefix: string = iconifySet) {
    
    const element = document.createElement("iconify-icon");
    element.icon = `${prefix}:${name}`;
    element.noobserver = true;
    
    if (!element.iconLoaded(element.icon)) {
        element.loadIcon(element.icon).catch(console.error);
    }

    return element;
    
}