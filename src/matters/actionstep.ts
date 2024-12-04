import { MatterItem } from ".";

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

        const id = data[0][1];
        if (!id) {
            throw new Error('actionstep id undefined');
        }

        const clientName = data[8][1];
        if (!clientName) {
            throw new Error('client fname undefined');
        }

        const file = await MatterItem.create(`${clientName}_${id}`);
        file.asref = Number(id);
        file.addParticipant(1, "party", mapParticipantData(data, 1));
        file.addParticipant(2, "party", mapParticipantData(data, 2));
        file.addParticipant(1, "lawyer", mapParticipantData(data, 3));
        file.addParticipant(2, "lawyer", mapParticipantData(data, 4));
        file.addParticipant(1, "counsel", mapParticipantData(data, 5));
        file.addParticipant(2, "counsel", mapParticipantData(data, 6));

        file.relationship = mapRelationshipData(data);
        for (const child of mapChildren(data)) {
            file.children.set(child.name.given, child)
        }

        
        if (data[2][1]) { // switch app/res
            const resID = Number(data[2][1]);
            if (resID === Number(data[4][1])) {
                file.respondent = true;
            }
        }
        
        MatterItem.current = file; // set current file
        

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

function mapContactType(i: number): ContactType {
    switch (i) {
        case 1:
        case 2: return "party";
        case 3:
        case 4: return "lawyer";
        case 5:
        case 6: return "counsel";
        default: throw new Error('participant index invalid');
    }
}

function mapParticipantData(data: string[][], i: number): ContactCard {
    // map results for participants using table[row][col]
    const result: ContactCard = {
        type: mapContactType(i),
        name: {
            given: data[6][i],
            family: data[8][i]
        },
        gender: getGender(data[12][i]),
        email: data[16][i],
        phones: getPhoneNums(data[17][i]),
        address: {
            main: {
                location: data[19][i] ? data[18][i] : undefined,
                street: data[19][i] ? data[19][i] : data[18][i],
                suburb: data[20][i],
                state: data[21][i],
                postcode: data[22][i],
                country: data[23][i]
            },
            post: {
                location: data[25][i] ? data[24][i] : undefined,
                street: data[25][i] ? data[25][i] : data[24][i],
                suburb: data[26][i],
                state: data[27][i],
                postcode: data[28][i],
                country: data[29][i]
            }
        },
        asref: Number(data[4][i])
    }

    return result;

    /*
    const fileWIP = { // do something with this later on
        name: {
            prefix: data[5][i],
            middle_name: data[7][i],
            suffix: data[9][i],
            aliases: data[10][i],
            preferred: data[11][i]
        }
    }*/
        
}

function mapRelationshipData(data: string[][]): RelationshipHistory {
    const dates = {
        cohab: data[31][1] ? getDate(data[31][1]) : data[32][1],
        marriage: data[31][2] ? getDate(data[31][2]) : data[32][2],
        separation: data[31][3] ? getDate(data[31][3]) : data[32][3],
        divorce: data[31][4] ? getDate(data[31][4]) : data[32][4],
    }
    const result: RelationshipHistory = {};
    for (const [key, val] of Object.entries(dates)) {
        if (val) {
            switch (key as keyof RelationshipHistory) {
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

function mapChildren(data: string[][]): ChildCard[] {
    const children = [];
    for (let r = 35; r < data.length; r++) {
        if (r > 35) {
            const row = data[r];
            const kid: ChildCard = {
                name: {
                    family: row[2],
                    given: row[1]
                },
                dob: getDate(row[3]),
                gender: getGender(row[4])
            }
            children.push(kid);
        }
    }
    return children;
}

function getGender(data: string = ""): Gender | undefined {
    const bit = data.slice(0, 1).toUpperCase();
    switch (bit) {
        case "M":
        case "F":
        case "X":
            return bit as Gender;
        default:
            return undefined;
    }
}

function getDate(data: string = ""): Date | undefined {
    const date = new Date(data);
    if (isNaN(+date)) {
        return undefined;
    }
    return date;
}

function getPhoneNums(data?: string): string[] {
    const list = data?.split("\r") || [];
    return list.filter(num => num != "****");
}