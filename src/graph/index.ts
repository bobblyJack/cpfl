import DatabaseRequest from "./cache";
import authFetch from "./fetch";
import formGraphURL from "./url";
import * as content from './content';
import collItems from "./collate";
import CPFL from "..";
import createGraphFolder from "./folder";

/**
 * abstract basic class item
 */
export class GraphObject implements GraphItem {

    protected static readonly index: Map<string, GraphObject> = new Map();
    protected static readonly scope: GraphScope;
    protected static readonly cache: GraphCache;

    protected static _root: string; // root folder id
    public static async get(id?: string) {
        if (!id) {
            if (!this._root) {
                const path: GraphURLFragment = this.cache ? `:/${this.cache}:/` : '/'
                const url = formGraphURL(path, this.scope);
                url.searchParams.append("$select", "id, folder");
                const res = await authFetch(url);
                const body = await res.json() as GraphItem;
                if (!body.folder) {
                    console.error(body);
                    throw new Error(`invalid root folder`);
                }
                this._root = body.id;
            }
            id = this._root;
        } 
        let obj = this.index.get(id);
        if (!obj) {
            let item: GraphItem;
            if (this.scope === "user") {
                item = {id}
            } else {
                const dbreq = await DatabaseRequest.init(this.cache);
                item = await dbreq.get(id);
            }
            obj = new this(item);
            this.index.set(id, obj);
        }
        return obj; 
    }

    public static async set(type: GraphItemType, name: string, parent?: GraphObject) {
        let item: GraphItem;
        if (!parent) {
            parent = await this.get();
        }
        if (type === "folder") {
            item = await createGraphFolder(name, parent, this.scope);
        } else {
            const itemPath: GraphURLFragment = `${parent.path}/${name}`;
            try {
                const checkResponseURL = formGraphURL(itemPath, this.scope);
                const checkResponse = await authFetch(checkResponseURL);
                const checkBody = await checkResponse.json() as GraphItem;
                CPFL.app.debug.err('redundant file creation');
                return this.get(checkBody.id);
            } catch (err) {
                CPFL.app.debug.log("attempting file creation", err);
                const res = await content.upload("", itemPath, this.scope);
                item = await res.json();
            }
        }
        const obj = new this(item);
        this.index.set(item.id, obj);
        return obj;
    }

    public readonly id: string;
    public readonly type: GraphItemType;
    public readonly parentReference: GraphItemReference;
    protected _name: string;
    protected _parent?: Promise<GraphObject>;
    protected _eTag?: string;
    protected _cTag?: string;
    protected _content?: string | string[];
    protected constructor(base: GraphItem) {
        this.id = base.id;
        this.type = base.folder ? "folder" : "file";
        if (!base.name) {
            throw new Error('undefined item name')
        }
        this._name = base.name;
        if (!base.parentReference) {
            throw new Error('undefined parent ref');
        }
        this.parentReference = base.parentReference;
        this._cTag = base.cTag;
        this._eTag = base.eTag;
        this._content = base.content;
    }

    protected _static<T extends typeof GraphObject>() {
        return this.constructor as T;
    }

    protected get _root(): boolean | undefined {
        if (!this._static()._root) {
            return undefined;
        }
        return this._static()._root === this.id;
    }

    public get scope(): GraphScope {
        if (!this._static().scope) {
            throw new Error('abstraction error');
        }
        return this._static().scope;
    }
    public get cache(): GraphCache {
        if (this.scope === 'user') {
            throw new Error('invalid scope');
        }
        if (!this._static().cache) {
            throw new Error('abstraction error');
        }
        return this._static().cache;
    }

    protected _updater: NodeJS.Timeout | null = null;
    protected async _update(patch: Partial<GraphItem>) {
        try {
            if (patch.name || patch.parentReference) { // update graph metadata
                const metaPatch: Partial<GraphItem> = {
                    name: patch.name,
                    parentReference: patch.parentReference
                }
                const update = JSON.stringify(metaPatch);
                await authFetch(this.url, 2, update);
                console.log('item metadata updated');
            }
            if (patch.content && this.type === "file") { // upload file content
                if (!this._updater) {
                    this._updater = setTimeout(async () => {
                        try {
                            await content.upload(this._content as string, this.path, this.scope);
                            console.log('item content updated');
                        } catch (err) {
                            console.error('error in timed content upload', err);
                        } finally {
                            this._updater = null;
                        } 
                    }, 5000);
                }
            }
            if (this.scope === "app") { // update local cache
                const dbreq = await DatabaseRequest.init(this.cache);
                await dbreq.set(patch, this.id);
                console.log('item cache updated');
            }
        } catch (err) {
            console.error('error updating item', err);
        }
    }

    public get name(): string {
        return this._name;
    }
    public set name(name: string) {
        if (name && name !== this.name) {
            this._update({name}).then(() => {
                this._name = name;
                console.log(this._name);
            });
        }
    }

    public get parent(): Promise<GraphObject> {
        if (!this._parent) {
            this._parent = this._static().get(this.id);
        }
        return this._parent;
    }
    public set parent(parent: string | GraphObject) {
        const id: string = parent instanceof GraphObject ? parent.id : parent;
        if (id !== this.parentReference.id) {
            this.parentReference.id = id;
            this._update({parentReference: {id}}).then(() => {
                if (parent instanceof GraphObject) {
                    this._parent = Promise.resolve(parent);
                } else {
                    this._parent = this._static().get(id);
                }
            });
        }
    }

    protected get url(): URL {
        return formGraphURL(`/items/${this.id}`, this.scope);
    }

    public get path(): GraphURLFragment {
        // relative to scope
        if (!this.parentReference.path) {
            throw new Error('invalid parent reference');
        }
        const i = this.parentReference.path.indexOf(":");
        const rawPath = this.parentReference.path.slice(i);
        const rawParts = rawPath.split("/");
        const parts = rawParts.slice(2);
        parts.push(this.name);
        return `:/${parts.join("/")}`
    }

    public get eTag() {
        return this._eTag;
    }
    public get cTag() {
        return this._cTag;
    }
    public get content() {
        return this._content;
    }

    protected async _download() {
        if (this.content) {
            const url = this.url;
            url.searchParams.append("$select", "eTag");
            const res = await authFetch(url);
            const body = await res.json() as GraphItem;
            const eTag = body.eTag;
            if (this.eTag && this.eTag === eTag) {
                return this.content;
            }
            if (eTag) {
                this._eTag = eTag;
            }
        }
        if (this.type === "file") { // string content
            this._content = await content.download(this.path, this.scope);
        } else if (this.type === "folder") { // string[] content (child ids)
            const url = formGraphURL(`${this.path}/children`, this.scope);
            const children = await collItems(url);
            this._content = children.map(item => item.id);
        } else {
            throw new Error('invalid item type');
        }
        return this._content;
    }

    protected async _parse<T extends {}>() {
        if (this.type === "folder") {
            throw new Error('invalid item type');
        }
        const text = await this._download() as string;
        return JSON.parse(text) as T;
    }

}