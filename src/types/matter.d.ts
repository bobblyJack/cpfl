interface RelationshipHistory {
    cohab?: {
        date: string | Date;
    }
    marriage?: {
        date: string | Date;
        place?: string;
        country?: string;
    }
    separation?: {
        date: string | Date;
    }
    divorce?: {
        date: string | Date;
        place?: string;
        country?: string;
    }
}

interface MatterChild {
    gnames?: string;
    fname?: string;
    dob?: Date;
    gender?: Gender;

}