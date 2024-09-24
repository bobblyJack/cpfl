import * as html from './html';
import * as router from './router';

Office.onReady((info) => {
    if (info.host === Office.HostType.Word) {
        router.log('Accessing 365...');
        init();
    } else {
        router.log('Office Host Error');
    }
});

async function init() {

    const user = await html.refresh();

    Word.run((context) => {
        for (const [key, value] of Object.entries(user)) {
            let msg = `${key}: ${value}`;
            context.document.body.insertParagraph(msg, Word.InsertLocation.end);
        }
        return context.sync();
    });

}