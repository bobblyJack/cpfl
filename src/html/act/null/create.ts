import { AppMatter } from "../../../matters";

export default function (main: HTMLElement) {
    const inputG = main.querySelector('#new-matter-gname') as HTMLInputElement;
    const inputF = main.querySelector('#new-matter-fname') as HTMLInputElement;
    const button = main.querySelector('#new-matter button') as HTMLButtonElement;
    button.onclick = () => {
        if (!inputG.value || !inputF.value) {
            console.error('value needed for new client name');
        } else {
            const card: ContactCard = {
                type: "party",
                name: {
                    given: inputG.value,
                    family: inputF.value
                }
            }
            AppMatter.create(card);
        }
    }
}