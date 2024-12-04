import {ContactItem} from "../contacts";
import { POV } from "./sides";


export class MatterParticipant implements ParticipantReference {
    public readonly id: string;
    public readonly type: ContactType;
    public readonly side: number | POV;
    
    public constructor(base: ParticipantReference) {
        this.id = base.id;
        this.type = base.type;
        this.side = base.side;
    }

    public async openContact<T extends ContactItem>(): Promise<T> {
        return ContactItem.open(this.id);
    }

}