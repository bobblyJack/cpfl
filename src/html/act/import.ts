// fetch initial file data from current word doc
// map results for participants using table[row][col]

export async function importActionstepMatter(): Promise<MatterData> {
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
        
        if (!data[0][1]) {
            throw new Error('actionstep id undefined');
        }

        return {
            id: Number(data[0][1]),
            appID: data[1][1] ? Number(data[1][1]) : undefined,
            resID: data[2][1] ? Number(data[2][1]) : undefined,
            client: {
                ...mapParticipantData(data, 1),
                dob: getDate(data[13][1]),
                country_of_birth: data[14][1],
                occupation: data[15][1]
            },
            lawyer: {
                ...mapParticipantData(data, 3),
                LCode: data[15][3]
            },
            counsel: {
                ...mapParticipantData(data, 5)
            },
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
            relationship: mapRelationshipData(data),
            children: mapChildren(data)
        }
        
    } catch (err) {
        console.error('could not import participant data');
        throw err;
    }

}

async function getTableValues(context: Word.RequestContext): Promise<string[][]> {
    const table = context.document.body.tables.items[0];
    table.load("values");
    await context.sync();
    return table.values;
}

function mapParticipantData(data: string[][], i: number): ParticipantData {
    return {
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
}

function mapRelationshipData(data: string[][]): RelationshipData {
    return {
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
}

function mapChildren(data: string[][]): ChildData[] {
    const children: ChildData[] = [];
    for (let r = 35; r < data.length; r++) {
        if (r > 35) {
            const row = data[r];
            const child: ChildData = {
                family_name: row[1],
                given_names: row[2],
                dob: getDate(row[3]),
                gender: getGender(row[4])
            }
            children.push(child);
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
    const list = data?.split("\n") || [];
    return list.filter(num => num != "****");
}