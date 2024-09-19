import * as auth from './auth';

export async function main() { 
    const user = await auth.getUser();
    writetoDoc(user.name);
}

async function writetoDoc(data: string) {
    return Word.run((context) => {
        context.document.body.insertParagraph("hi there " + data, Word.InsertLocation.end);
        return context.sync();
    });
}