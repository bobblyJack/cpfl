type ContactType = "party" | "lawyer" | "counsel";

interface ContactCard {
    asref?: number; // actionstep id
    type: ContactType;
    name: Name;
    email?: string;
    gender: FieldData<Gender>;
    dob: FieldData<Date>;
    occupation?: string;
    phones?: string[];
    address: StreetAddresses;
}

interface Name {
    given: FieldData<string>;
    family: FieldData<string>;
}

type Gender = "M" | "F" | "X";

interface StreetAddresses {
    main: StreetAddress;
    splitter: FieldData<boolean>; // main != post
    post: StreetAddress | null;
}

interface StreetAddress {
    location: FieldData<string>;
    street: FieldData<string>;
    suburb: FieldData<string>;
    state: FieldData<AusState> | FieldData<string>;
    postcode: FieldData<string>;
    country: FieldData<string>;
}

type AusState = "SA" | "VIC" | "NSW" | "QLD" | "TAS" | "WA" | "NT" | "ACT";
