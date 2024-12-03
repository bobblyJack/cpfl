type ContactType = "party" | "lawyer" | "counsel";

interface ContactCard {
    type: ContactType;
    gnames: string;
    fname: string;
    email: string;
    gender: Gender;
    dob: Date;
    occupation: string;
    phones: string[];
    mainAdd: StreetAddress;
    postAdd: StreetAddress | null;
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

