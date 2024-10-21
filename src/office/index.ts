import officeAPI from './api.html';
export function loadAPI() {
    document.head.innerHTML += officeAPI;
}

export async function startWord(context: any) {
    const button = document.createElement("button");
    button.textContent = "Test Function";
    button.onclick = runTest;
    context.appendChild(button);
}

export async function startExcel(context: any) {
    console.error('Excel Host WIP'); // WIP
}

async function runTest() {
    
    try {
        printTest("hello world");
        
    } catch (err) {
        console.error('test error');
        console.log(err);
    }
    
}

async function printTest(value: string) {
    Word.run((context) => {
        context.document.body.insertParagraph(value, "End");
        return context.sync();
    })
}


async function officeStart(host: Office.HostType) {

    const context: any = {};

    switch (host) { // WIP: expand hosts
        case Office.HostType.Word: {
            startWord(context);
            break;
        }
        case Office.HostType.Excel: {
            startExcel(context);
            break;
        }
        default: { // WIP: default website view
            console.log('Default Host WIP');
        }
    }

}
