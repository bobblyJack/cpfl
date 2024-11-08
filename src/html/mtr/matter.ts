// matter data

export class ActiveMatter {

    public static async load(asid: number) { // fetch active matter from storage
        return {} as ActiveMatter;
    }

    public static async import() { // get initial data from current word doc
        return {} as ActiveMatter;
    }

    readonly id: number; // actionstep id
    appID?: number; // applicant id
    resID?: number; // respondent id
    constructor(asid: number) {
        this.id = asid;
        // deal with json file here
    }

    relationship: RelationshipData;
    children: ChildData[];

    rp: PartyData; // responsible party
    op: PartyData; // other party

    rl: LawyerData; // responsible lawyer
    ol: LawyerData; // other party's lawyer

    rc: CounselData; // responsible counsel
    oc: CounselData; // other party's counsel

    save() {

    }

    exit() {

    }

}
