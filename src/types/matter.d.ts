interface MatterCard {
    participants: Map<ParticipantReferenceKey, ParticipantReference[]>;
    relationship: RelationshipHistory;
    children: Map<string, ChildCard>; // given name -> child
    asref?: number; // actionstep id
    respondent?: boolean;
}

type ParticipantReferenceKey = `${number}_${ContactType}` // side+type -> contacts

interface ParticipantReference {
    id: string;
    type: ContactType;
    side: number;
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