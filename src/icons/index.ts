import 'iconify-icon';
import {IIconReference} from './list';

/**
 * create iconify icon html element
 * @param name icon string name
 * @param prefix overwrite default iconify set
 * @wip return a default error icon if name invalid
 * @wip might need to return of noob server
 */
export function createIIcon(key: keyof typeof IIconReference): HTMLIconifyElement {
    
    let name: string = IIconReference[key];
    let prefix: string = "carbon"; // default icon set

    if (name.includes(":")) {
        const split = name.indexOf(":");
        prefix = name.slice(split + 1);
        name = name.slice(0, split);
    }
    
    const element = document.createElement("iconify-icon");
    element.icon = `${prefix}:${name}`;
    
    if (!element.iconLoaded(element.icon)) {
        element.loadIcon(element.icon).catch(console.error);
    }

    return element;
    
}