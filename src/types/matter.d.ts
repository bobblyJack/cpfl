type ParticipantType = "party" | "lawyer" | "counsel";

type Gender = "M" | "F" | "X";

interface Address {
    location?: string;
    street: string;
    suburb: string;
    state: string;
    postcode: string;
    country?: string;
}

interface RelationshipData {
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