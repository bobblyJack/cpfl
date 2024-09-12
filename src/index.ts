import * as html from './html/elements';
let switchedOn = false;

// initialise office
Office.onReady((info) => {
    if (info.host === Office.HostType.Word) {
        html.errors.off();
        html.buttons.run.addEventListener("click", () => Word.run((context) => main(context)));
        //html.buttons.run.addEventListener("click", () => Word.run(main));
    }
});

// say hello
async function main(context: Word.RequestContext) { 
    context.document.body.insertParagraph("hi there.", Word.InsertLocation.start);
    await context.sync();
    if (!switchedOn) {
        setTimeout(() => html.console.log('nice.'), 5000);
        switchedOn = true;
    }
}