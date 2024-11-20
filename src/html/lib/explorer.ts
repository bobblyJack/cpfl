import { PageHTML } from "..";
import { createIIcon } from "../../icons";

/**
 * instance a class to manage navigating between folders
 * (or maybe do this another way idk)
 */
export class LibExplorer {

    public static get page() {
        return PageHTML.get('lib');
    }

    private static _current: LibExplorer;
    public static get current() {
        if (!this._current) {
            throw new Error('no folder open');
        }
        return this._current;
    }
    
    public static set label(text: string) {
        const e = this.page.get('h2', 'path');
        e.textContent = text;
    }

    public static set main(content: HTMLDivElement) {
        const container = this.page.get('div', 'list');
        container.replaceChildren(content);
    }

    public static set back(folder: LibExplorer | null) {
        let button: HTMLButtonElement;
        try {
            button = this.page.get('button', 'back');
        } catch {
            button = this.page.set('button', 'back');
            this.page.fnav.appendChild(button);
        }
        if (folder) {
            button.disabled = false;
            button.hidden = false;
            button.textContent = `BACK: ${this.current.name}`;
            button.onclick = () => {
                this.open(folder.id, folder.name, folder.parent);
            }
        } else {
            button.disabled = true;
            button.hidden = true;
        }
        
    }

    private static index: Map<string, LibExplorer> = new Map();
    public static async open(id?: string, name?: string, parent?: LibExplorer) {
        let folder = this.index.get(id || ".");
        if (!folder) {
            const collection = await this.page.app.user.drive.collection(id);
            folder = new LibExplorer(id || ".", name || "./", collection);
            this.index.set(folder.id, folder);
        }
        
        this.label = folder.path;
        this.main = folder.content;
        this.back = parent ? parent : null;
        this._current = folder;
    }

    public readonly id: string;
    public name: string;
    public parent?: LibExplorer;
    public content: HTMLDivElement;
    private constructor(id: string, name: string, items: DriveItem[], parent?: LibExplorer) {
        this.id = id;
        this.name = name;
        this.parent = parent;
        this.content = LibExplorer.page.set("div", id);

        for (const item of items) {
            const entry = document.createElement("button");
            let icon: HTMLIconifyElement;

            if (item.file) {
                icon = createIIcon("file");
                entry.ondblclick = () => {
                    try {
                        Word.run(async (context) => {
                            const content = await LibExplorer.page.app.user.drive.content(item.id);
                            context.document.insertFileFromBase64(content, "Replace");
                            await context.sync();
                        });
                    } catch (err) {
                        console.error(err);
                    }
                }

            } else if (item.folder) {
                icon = createIIcon("folder");
                entry.ondblclick = () => {
                    LibExplorer.open(item.id, item.name, this);
                }
                
            } else {
                icon = createIIcon("missing");
                entry.ondblclick = () => {
                    console.error('this one is confused and content-fluid');
                }
            }
            entry.appendChild(icon);

            const label = document.createElement("span");
            label.textContent = item.name;
            entry.appendChild(label);

            this.content.appendChild(entry);
        }

    }

    public get path(): string {
        if (!this.parent) {
            return this.name;
        }
        return this.parent.path + this.name;
    }

}