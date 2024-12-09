import DatabaseRequest from "./cache";
import authFetch from "./fetch";
import formGraphURL from "./url";

/**
 * session map of instanced objects
 */
const sessionMap: Map<string, GraphObject> = new Map();

export class GraphObject implements GraphItem {

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
        let obj = sessionMap.get(id);
        if (!obj) {
            let item: GraphItem;
            if (this.scope === "user") {
                item = {id}
            } else {
                const dbreq = await DatabaseRequest.init(this.cache);
                item = await dbreq.get(id);
            }
            obj = new this(item);
            sessionMap.set(id, obj);
        }
        return obj;
        
    }

    public readonly id: string;
    public readonly type: "file" | "folder";
    protected constructor(base: GraphItem) {
        this.id = base.id;
        this.type = base.folder ? "folder" : "file";
    }

    public get scope(): GraphScope {
        const staticBase = this.constructor as typeof GraphObject;
        if (!staticBase.scope) {
            throw new Error('abstraction error');
        }
        return staticBase.scope;
    }
    public get cache(): GraphCache {
        if (this.scope === 'user') {
            throw new Error('invalid scope');
        }
        const staticBase = this.constructor as typeof GraphObject;
        if (!staticBase.cache) {
            throw new Error('abstraction error');
        }
        return staticBase.cache;
    }

    public async save() {

    }

    


}