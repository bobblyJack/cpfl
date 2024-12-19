/**
 * checks elements to enforce a unique ID
 * @param element the html element to label
 * @param id the string id base
 */
export default function setUniqueID(element: HTMLElement, id: string) {
    try {
        return getUniqueID(element, id);
    } catch (err) {
        console.error('error setting unique element id', err);
    }
}

function getUniqueID(e: HTMLElement, id: string, i: number = 0) {
    let unique: string = id;
    if (i) {
        unique += String(i);
    }
    const exists = document.getElementById(unique);
    if (exists) {
        return getUniqueID(e, id, i++);
    }
    e.id = unique;
}