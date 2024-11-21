import { ParticipantLink } from "./enum";

export abstract class MatterParticipant {

    public static create(party: ParticipantLink.rp | ParticipantLink.op): MatterParty;
    public static create(lawyer: ParticipantLink.rl | ParticipantLink.ol): MatterLawyer;
    public static create(counsel: ParticipantLink.rc | ParticipantLink.oc): MatterCounsel;
    public static create(participant: ParticipantLink): MatterParticipant;
    public static create(key: ParticipantLink) {
        const pType: string = typeof key === 'number' ? ParticipantLink[key] : key;
        if (pType.includes("p")) {
            return new MatterParty(key);
        } else if (pType.includes("l")) {
            return new MatterLawyer(key);
        } else if (pType.includes("c")) {
            return new MatterCounsel(key);
        } else {
            throw new Error('participant type undefined');
        }
    }

    public readonly key: ParticipantLink;
    public gname: string = "";
    public fname: string = "";
    public gender?: Gender;
    public email?: string;
    public phone?: string;
    public address?: Partial<Address>; // TBD: add postal address

    protected constructor(key: ParticipantLink) {
        this.key = key;
    }

    public get name(): string {
        return `${this.gname} ${this.fname}`;
    }
    
}

/**
 * parties (client / other side)
 */
class MatterParty extends MatterParticipant {
    dob?: Date;
    occupation?: string;

    public get age(): number {
        if (!this.dob) {
            throw new Error('age calculation requires dob')
        }
        const today = new Date();
        let age = today.getFullYear() - this.dob.getFullYear();
        const months = today.getMonth() - this.dob.getMonth();
        if (months === 0) {
            if (today.getDate() < this.dob.getDate()) {
                age--;
            }
        } else if (months < 0) {
            age--;
        }
        return age;
    }
}

/**
 * solicitors
 * @TBD two indices of contact data (our firm, other firms)
 */
class MatterLawyer extends MatterParticipant {
    firm?: string;
    lcode?: string;
}

/**
 * barristers
 * @TBD an index of available counsel
 */
class MatterCounsel extends MatterParticipant {
    chambers?: string;
}