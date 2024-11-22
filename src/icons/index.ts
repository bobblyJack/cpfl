import 'iconify-icon';
import createIIcon from './element';

const iicon = {
    create: createIIcon,
    ref: {
        hub: "home",
    
        // active matter
        act: "credentials",
        spouse: "partnership",
        ship: "calendar-heat-map",
        kids: "pedestrian-child",
        counsel: "share-knowledge",
        
        // balance sheet
        bal: "calculation",
    
        // precedent library
        lib: "document",
        file: "document-blank",
        folder: "folder",
    
        // user settings
        usr: "settings",
    
        // errors and such
        err: "error",
        null: "missing"
    }
}

export default iicon;