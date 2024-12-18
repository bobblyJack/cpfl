type ContactType = "party" | "lawyer" | "counsel";

interface ContactCard {
    asref?: number; // actionstep id
    type: ContactType;
    name: Name;
    email?: string;
    gender?: Gender;
    dob?: Date;
    occupation?: string;
    phones?: string[];
    address?: StreetAddresses;
}

interface Name {
    given: string;
    family: string;
}

type Gender = "M" | "F" | "X";

interface StreetAddresses {
    main: StreetAddress;
    split?: boolean; // main != post
    post?: StreetAddress | null;
}

interface StreetAddress {
    location?: string;
    street: string;
    suburb: string;
    state: AusState | string;
    postcode: string;
    country?: string;
}

type AusState = "SA" | "VIC" | "NSW" | "QLD" | "TAS" | "WA" | "NT" | "ACT";
