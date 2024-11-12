// matter data

import { getTableValues } from "../../office/table";

export class ActiveMatter {

    public static async load(asid: number) { // fetch active matter from storage
        return {} as ActiveMatter;
    }

    public static async import() { // get initial data from current word doc
        try {
            const table = await Word.run(context => getTableValues(context));
            const data = table.map(row => {
                return row.map((cell, i) => {
                    if (cell === "****") {
                        return "";
                    }
                    return cell;
                });
            });
            
            if (!data[0][1]) {
                throw new Error('actionstep id undefined');
            }

            const mtr = new ActiveMatter(data[0][1]);
            mtr.appID = data[1][1] ? Number(data[1][1]) : undefined;
            mtr.resID = data[2][1] ? Number(data[2][1]) : undefined;

            // map results for participants using table[row][col]

            for (let i = 1; i <= 6; i++) {
                const participant: ParticipantData = {
                    id: Number(data[4][i]),
                    name: {
                        prefix: data[5][i],
                        first_name: data[6][i],
                        middle_name: data[7][i],
                        last_name: data[8][i],
                        suffix: data[9][i],
                        aliases: data[10][i],
                        preferred: data[11][i]
                    },
                    gender: getGender(data[12][i]),
                    email: data[16][i],
                    phone: getPhoneNums(data[17][i]),
                    main_address: {
                        address_line_1: data[18][i],
                        address_line_2: data[19][i],
                        city: data[20][i],
                        state_province: data[21][i],
                        postcode: data[22][i],
                        country_if_foreign: data[23][i]
                    },
                    postal_address: {
                        address_line_1: data[24][i],
                        address_line_2: data[25][i],
                        city: data[26][i],
                        state_province: data[27][i],
                        postcode: data[28][i],
                        country_if_foreign: data[29][i]
                    }
                }

                if (i === 1 || i === 2) {
                    const party: PartyData = {
                        ...participant,
                        dob: getDate(data[13][i]),
                        country_of_birth: data[14][i],
                        occupation: data[15][i]
                    }
                    if (i === 1) {
                        mtr.rp = party;
                    } else if (i === 2) {
                        mtr.op = party;
                    }

                } else if (i === 3 || i === 5) {
                    const lawyer: LawyerData = {
                        ...participant,
                        LCode: data[15][i]
                    }
                    if (i === 3) {
                        mtr.rl = lawyer;
                    } else if (i === 5) {
                        mtr.ol = lawyer;
                    }

                } else {
                    const counsel: CounselData = {
                        ...participant
                    }
                    if (i === 4) {
                        mtr.rc = counsel;
                    } else if (i === 6) {
                        mtr.oc = counsel;
                    }
                }
            }

            mtr.relationship = {
                cohab: {
                    date: data[31][1] ? getDate(data[31][1]) : data[32][1]
                },
                marriage: {
                    date: data[31][2] ? getDate(data[31][2]) : data[32][2],
                    place: data[33][2],
                    country: data[34][2]
                },
                separation: {
                    date: data[31][3] ? getDate(data[31][3]) : data[32][3]
                },
                divorce: {
                    date: data[31][4] ? getDate(data[31][4]) : data[32][4],
                    place: data[33][4],
                    country: data[34][4]
                }
            }

            for (let r = 35; r < data.length; r++) {
                if (r !== 35) {
                    const row = data[r];
                    const child: ChildData = {
                        family_name: row[1],
                        given_names: row[2],
                        dob: getDate(row[3]),
                        gender: getGender(row[4])
                    }
                    mtr.children.push(child);
                }
            }
            
            return mtr;
        } catch (err) {
            console.error('could not import participant data');
            throw err;
        }

        function getGender(data?: string): Gender | undefined {
            const bit = data?.slice(0, 1).toUpperCase();
            switch (bit) {
                case "M":
                case "F":
                case "X":
                    return bit as Gender;
                default:
                    return undefined;
            }
        }

        function getDate(data?: string): Date | undefined {
            const date = new Date(data || "");
            if (isNaN(+date)) {
                return undefined;
            }
            return date;
        }

        function getPhoneNums(data?: string): string[] {
            const list = data?.split("\n") || [];
            return list.filter(num => num != "****");
        }
    }

    readonly id: number; // actionstep id
    appID?: number; // applicant id
    resID?: number; // respondent id
    constructor(asid: string | number) {
        this.id = Number(asid);
        // deal with json file here
    }

    relationship?: RelationshipData;
    children: ChildData[] = [];

    rp?: PartyData; // responsible party
    op?: PartyData; // other party

    rl?: LawyerData; // responsible lawyer
    ol?: LawyerData; // other party's lawyer

    rc?: CounselData; // responsible counsel
    oc?: CounselData; // other party's counsel

    save() {

    }

    exit() {

    }

}
