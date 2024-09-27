import * as html from './html';
import * as router from './router';

Office.onReady((info) => {
    if (info.host === Office.HostType.Word) {
        init();
    } else {
        console.error('Office Host Error');
    }
});

async function init() {
    await html.refresh();
    const runButton = html.addElement('run-button', 'button');
    runButton.textContent = "Get Drive Content";
    runButton.onclick = printData;
    const userButton = html.addElement('user-button', 'button');
    userButton.textContent = "Get Access Token";
    userButton.onclick = () => {
        Word.run((context) => {
            const data = router.getPayload;
            context.document.body.insertParagraph(JSON.stringify(data), "Start");
            return context.sync();
        });
    }

}

async function printData() {
    try {
        const data = await router.getFiles();
        Word.run((context) => {
            context.document.body.insertParagraph(JSON.stringify(data), "End");
            return context.sync();
        });

    } catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
        } else {
            console.error('unknown error caught');
        }
        throw err;
    }

}