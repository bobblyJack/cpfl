type ContactType = "party" | "lawyer" | "counsel";

interface ContactCard {
    type: ContactType;
    name?: Name;
    email?: string;
    gender?: Gender;
    dob?: Date;
    occupation?: string;
    phones?: string[];
    address?: StreetAddresses;
    asref?: number; // actionstep id
}

interface Name {
    given: string;
    family: string;
}

type Gender = "M" | "F" | "X";

interface StreetAddresses {
    main: StreetAddress;
    post?: StreetAddress | null;
}

interface StreetAddress {
    location?: string;
    street: string;
    suburb: string;
    state: string;
    postcode: string;
    country?: string;
}

