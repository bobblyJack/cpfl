export async function getTableValues(context: Word.RequestContext, i: number = 0): Promise<string[][]> {

    const table = context.document.body.tables.items[i];
        
    table.load("values");
    await context.sync();

    return table.values;

}