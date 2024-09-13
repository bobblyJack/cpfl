import {auth} from './auth/auth';

export async function main() { 
    const data = await auth();
    writetoDoc(data);
}

async function writetoDoc(data: any) {
    return Word.run((context) => {
        const userInfo: string = data["displayName"];
        context.document.body.insertParagraph("hi there " + userInfo, Word.InsertLocation.start);
        return context.sync();
    })
}