interface MatterCard {
    asref?: number; // actionstep id
    participants: ParticipantRoles;
    relationship: RelationshipHistory;
    children: ChildCard[];
    respondent?: boolean; // app/res toggle
}

/**
 * nested contact tree from role pov -> contact id[]
 */
interface ParticipantRoles { // nested contact tree
    [side: number]: Map<ContactType, string[]>;
}

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

interface ChildCard {
    name: Name;
    dob?: Date;
    gender?: Gender;
}