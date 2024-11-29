type ParticipantType = "party" | "lawyer" | "counsel";
type ParticipantTypeMap = Map<ParticipantType, ParticipantSideMap>;
type ParticipantSideMap = Map<number, ParticipantRoleMap>;
type ParticipantRoleMap = Map<number, ParticipantRole>;

interface MatterFile { // active matter interface

}

interface MatterParticipant {
    
}

type Gender = "M" | "F" | "X";

interface StreetAddress {
    location?: string;
    street: string;
    suburb: string;
    state: string;
    postcode: string;
    country?: string;
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

interface MatterChild {
    gnames?: string;
    fname?: string;
    dob?: Date;
    gender?: Gender;

}