import iicon from "./";
const defaultSet = "carbon"

/**
 * create iconify icon html element
 * @param name icon string name
 * @param prefix overwrite default iconify set
 */
export default function createIIcon(key: string): HTMLIconifyElement {

    try {
        let name: string = iicon.ref["null"];
        if (key in iicon.ref) {
            name = iicon.ref[key as keyof typeof iicon.ref];
        }
        
        let prefix: string = defaultSet;

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

    } catch (err) {
        console.error('error creating iconify element', err);
        return createIIcon('err');
    }
    
}