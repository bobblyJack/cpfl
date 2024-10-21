export async function swapTemplate(template: string) {
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