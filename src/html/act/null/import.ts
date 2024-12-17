import CPFL from "../../..";
import { AppMatter } from "../../../matters";

export default function (main: HTMLElement) {
    const importSection = main.querySelector('#import-matter') as HTMLDivElement;
    if (CPFL.app.mode !== "taskpane") {
        importSection.hidden = true;
    } else {
        const importButton = importSection.querySelector('button') as HTMLButtonElement;
        importButton.onclick = () => AppMatter.import();
    }
}