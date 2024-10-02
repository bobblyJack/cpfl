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

    let name = user.account.name || 'Anon ';
    name = name.slice(0, name.indexOf(" "));
    html.app.header.textContent += name;

    const runButton = html.addElement('button');
    runButton.textContent = "Test Function";
    runButton.onclick = test;
}

async function test() {
    try {
        const token = await auth.getToken();
        const data = await auth.fetchData(token);
        await printData(data);
        
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

async function printData(data: any) {
    Word.run((context) => {
        const value = JSON.stringify(data);
        context.document.body.insertParagraph(value, "End");
        return context.sync();
    });
}