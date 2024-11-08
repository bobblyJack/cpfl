
interface ParticipantName {
    prefix?: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    suffix?: string;
    aliases?: string;
    preferred?: string;
}

type Gender = "M" | "F" | "X";

interface Address {
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state_province: string;
    postcode: string;
    country_if_foreign?: string;
}

interface ParticipantData {
    readonly id: number;
    name: ParticipantName;
    gender?: Gender;
    email: string;
    phone: string[];
    main_address: Address;
    postal_address?: Address;
}

interface PartyData extends ParticipantData {
    dob: Date;
    country_of_birth?: string;
    occupation?: string;
}

interface LawyerData extends ParticipantData {
    LCode?: string;
}

interface CounselData extends ParticipantData {
    
}

interface ChildData {
    given_names: string;
    family_name: string;
    dob: Date;
    gender: Gender;
}

interface RelationshipData {
    cohab: {
        date: string | Date;
    }
    marriage: {
        date: string | Date;
        place: string;
        country: string;
    }
    separation: {
        date: string | Date;
    }
    divorce: {
        date: string | Date;
        place: string;
        country: string;
    }
}