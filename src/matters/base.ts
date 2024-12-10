import { GraphObject } from "../graph";

export class MatterObject extends GraphObject {
    public static readonly scope: GraphScope = "app";
    public static readonly cache: GraphCache = "matters";

    public static async get(id?: string) {
        return super.get(id) as Promise<MatterObject>
    }
    public static async set(name: string): Promise<MatterObject> {
        return super.set("file", name)
    }
}