import { ActiveMatter } from ".";

enum MatterSides {
    neutral,
    ours,
    theirs,
    thirdParty
}

export class ParticipantRole {

    public static set(matter: ActiveMatter, type: "party", side?: MatterSides | number): MatterParty;
    public static set(matter: ActiveMatter, type: "lawyer", side?: MatterSides | number): MatterLawyer;
    public static set(matter: ActiveMatter, type: "counsel", side?: MatterSides | number): MatterCounsel;
    public static set(matter: ActiveMatter, type: ParticipantType, side: MatterSides | number = MatterSides.ours) {
        switch (type) {
            case "party": return new MatterParty(matter, side);
            case "lawyer": return new MatterLawyer(matter, side);
            case "counsel": return new MatterCounsel(matter, side);
        }
    }

    public readonly type: ParticipantType;
    public readonly matter: ActiveMatter;
    public readonly side: number; // follows POV notation (0 neutral, 1 ours, 2 theirs, 3 third party, etc)
    public id: number = 0; // participant map index ref for multi-participant types
    
    public gnames: string = ""; // TBD: name interface
    public fname: string = "";
    public email: string = ""; // TBD: email verification
    public gender?: Gender;
    public phones: string[] = []; // TBD: better phone number handling
    public mainAdd: Partial<StreetAddress> = {};
    public postAdd: Partial<StreetAddress> | false = false;

    protected constructor(type: ParticipantType, matter: ActiveMatter, side: number) {
        this.type = type;
        this.matter = matter;
        this.side = side;
        this.matter.set(this);
    }

    public get initials(): string {
        let initials = "";
        const names = this.gnames.split(" ").concat(this.fname.split(" "));
        for (const name of names) {
            initials += name.slice(0,1);
        }
        return initials.toUpperCase();
    }

}

export class MatterParty extends ParticipantRole {
    public dob?: Date;
    public occupation?: string;

    public constructor(matter: ActiveMatter, side: number) {
        super("party", matter, side);
    }

    public get age(): number {
        if (!this.dob) { // TBD: better error handling
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

// TBD: index of firms and chambers
export class MatterLawyer extends ParticipantRole {
    public firm?: string;
    public lcode?: string;
    public constructor(matter: ActiveMatter, side: number) {
        super("lawyer", matter, side);
    }
}

export class MatterCounsel extends ParticipantRole {
    public chambers?: string;
    public constructor(matter: ActiveMatter, side: number) {
        super("counsel", matter, side);
    }
}