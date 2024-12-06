import 'iconify-icon';

const defaultSet = "carbon"

function mapIIcon(key: string) {
    switch (key as AppKey) {
        case 'hub': return "home";
        case 'act': return "credentials";
        case 'act_us': return "credentials";
        case 'act_them': return "partnership";
        case 'act_ship': return "calendar-heat-map";
        case 'act_kids': return "pedestrian-child";
        case 'act_bar': return "share-knowledge";
        case 'lib': return "document";
        case 'bal': return "calculation";
        case 'usr': return "settings";
        case 'file': return "document-blank";
        case 'folder': return "folder";
        case 'err': return "error";
        default: return "missing";
    }
}

/**
 * create iconify icon html element
 * @param name icon string name
 * @param prefix overwrite default iconify set
 */
export default function createIIcon(key: string): HTMLIconifyElement {

    try {
        let name: string = mapIIcon(key);
        
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