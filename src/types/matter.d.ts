type ParticipantType = "party" | "lawyer" | "counsel";

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