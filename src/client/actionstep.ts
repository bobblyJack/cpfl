import { MatterChild } from "./kids";
import { ActiveMatter } from "./matter";
import { MatterParticipant } from "./participant";


/**
 * fetch actionstep matter data from current word doc
 * (via specific actionstep template)
 */
export default async function () {
    try {
        const table = await Word.run(context => getTableValues(context));
        const data = table.map(row => {
            return row.map((cell) => {
                if (cell === "****") {
                    return "";
                }
                return cell;
            });
        });
        
        if (!data.length) {
            throw new Error('null actionstep data');
        }

        const id = Number(data[0][1]);
        if (!id) {
            throw new Error('actionstep id undefined');
        }

        const file = new ActiveMatter(id);
        mapParticipantData(data, 1, file.client);
        mapParticipantData(data, 3, file.lawyer);
        mapParticipantData(data, 5, file.counsel);

        file.relationship = mapRelationshipData(data);
        file.kids = mapChildren(data);

        
        if (data[2][1]) { // switch app/res
            const resID = Number(data[2][1]);
            if (resID === Number(data[4][1])) {
                file.respondent = true;
            }
        }
        
        ActiveMatter.current = file; // set current file
        

        // WIP
        /* 
        const clientWIP = {
            dob: getDate(data[13][1]),
            country_of_birth: data[14][1],
            occupation: data[15][1]
        }

        const lawyerWIP = {
            LCode: data[15][3]
        }

        op: {
            ...mapParticipantData(data, 2),
            dob: getDate(data[13][2]),
            country_of_birth: data[14][2],
            occupation: data[15][2]
        },
        ol: {
            ...mapParticipantData(data, 4),
            LCode: data[15][4]
        },
        oc: {
            ...mapParticipantData(data, 6)
        },
        
        
        */
        
    } catch (err) {
        console.error('could not import participant data');
        throw err;
    }

}

async function getTableValues(context: Word.RequestContext): Promise<string[][]> {
    
    const tables = context.document.body.tables;
    tables.load({
        $top: 1,
        values: true
    });
    
    await context.sync();

    if (tables.items.length) {
        return tables.items[0].values;
    }
    throw new Error('export table is missing');
}

function mapParticipantData(data: string[][], i: number, p: MatterParticipant) {
    // map results for participants using table[row][col]
    p.gname = data[6][i];
    p.fname = data[8][i];
    p.gender = getGender(data[12][i]);
    p.email = data[16][i];
    p.phone = getPhoneNums(data[17][i])[0];
    p.address = {
        location: data[19][i] ? data[18][i] : undefined,
        street: data[18][i] ? data[19][i] : data[18][i],
        suburb: data[20][i],
        state: data[21][i],
        postcode: data[22][i],
        country: data[23][i]
    }

    /*
    const fileWIP = { // do something with this later on
        id: Number(data[4][i]),
        name: {
            prefix: data[5][i],
            middle_name: data[7][i],
            suffix: data[9][i],
            aliases: data[10][i],
            preferred: data[11][i]
        },
        postal_address: {
            address_line_1: data[24][i],
            address_line_2: data[25][i],
            city: data[26][i],
            state_province: data[27][i],
            postcode: data[28][i],
            country_if_foreign: data[29][i]
        }
    }*/
        
}

function mapRelationshipData(data: string[][]): RelationshipData {
    const dates = {
        cohab: data[31][1] ? getDate(data[31][1]) : data[32][1],
        marriage: data[31][2] ? getDate(data[31][2]) : data[32][2],
        separation: data[31][3] ? getDate(data[31][3]) : data[32][3],
        divorce: data[31][4] ? getDate(data[31][4]) : data[32][4],
    }
    const result: RelationshipData = {};
    for (const [key, val] of Object.entries(dates)) {
        if (val) {
            switch (key as keyof RelationshipData) {
                case "cohab": {
                    result.cohab = {
                        date: val
                    }
                    break;
                }
                case "marriage": {
                    result.marriage = {
                        date: val,
                        place: data[33][2],
                        country: data[34][2]
                    }
                    break;
                }
                case "separation": {
                    result.separation = {
                        date: val
                    }
                    break;
                }
                case "divorce": {
                    result.divorce = {
                        date: val,
                        place: data[33][4],
                        country: data[34][4]
                    }
                    break;
                }
            }
        }
    }
    return result;
}

function mapChildren(data: string[][]) {
    const children = [];
    for (let r = 35; r < data.length; r++) {
        if (r > 35) {
            const row = data[r];
            const kid = new MatterChild(row[2], row[1], getDate(row[3]), getGender(row[4]))
            children.push(kid);
        }
    }
    return children;
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
    const list = data?.split("\r") || [];
    return list.filter(num => num != "****");
}