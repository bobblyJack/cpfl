import * as html from './html';
import * as auth from './auth';

Office.onReady((info) => {
    if (info.host === Office.HostType.Word) {
        init();
    } else {
        console.error('Office Host Error');
    }
});

async function init() {
    const user = await auth.getUser();
    html.app.header.textContent += String(user['given_name']);

    const runButton = html.addElement('button');
    runButton.textContent = "Fetch Letterhead";
    runButton.onclick = test;
}

async function test() {
    try {
        const data = await auth.getItemID('Letterhead.dotx');
        await printData(data);
        console.log(JSON.parse(JSON.stringify(data, null, 2)));
        console.log('test complete');
    } catch (err) {
        if (err instanceof Error) {
            console.warn(err.message);
            console.error(err);
        } else {
            console.warn('unknown error caught');
            console.error(err);
        }
        throw err;
    }
}

async function getLetterhead(id: string) {
    //const letterheadID = '/items/013NZABFTR33KWDKUGWVCLIKUL32XBZJNO/';
    //const item = await auth.queryGraph(id) as Record<string, any>;
    //const path = item['@microsoft.graph.downloadUrl'];
    //const template = await auth.getFile(path);
    //await changeTemplate(template);
}

async function printData(data: any) {
    Word.run((context) => {
        const value = JSON.stringify(data);
        context.document.body.insertParagraph(value, "End");
        return context.sync();
    })
}

async function changeTemplate(template: string) {
    Word.run((context) => {
        context.document.insertFileFromBase64(template, "Replace", {
            importTheme: true,
            importStyles: true,
            importParagraphSpacing: true,
            importDifferentOddEvenPages: true
        });
        return context.sync();
    });
}