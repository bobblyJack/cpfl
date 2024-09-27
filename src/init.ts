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
        
    const data = await router.getFiles();
    
    Word.run((context) => {
        context.document.body.insertParagraph(JSON.stringify(data), "End");
        return context.sync();
    });

    
    

}