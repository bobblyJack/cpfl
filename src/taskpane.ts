// define variables
const runButton = document.getElementById("run-button");

// initialise office
Office.onReady((info) => {
    if (info.host === Office.HostType.Word) {
        if (runButton) {
            runButton.addEventListener("click", () => Word.run((context) => main(context)));
        }
    }
});

// say hello
async function main(context: Word.RequestContext) { 
    context.document.body.insertParagraph("Hello World", Word.InsertLocation.start);
    await context.sync();
}