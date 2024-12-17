import { AppMatter } from "../../../matters";

export default async function (main: HTMLElement) {
    const loadSection = main.querySelector('#load-matter') as HTMLDivElement;
    const loadSelector = loadSection.querySelector('select') as HTMLSelectElement;
    const loadButton = loadSection.querySelector('button') as HTMLButtonElement;

    const list = await AppMatter.list();
    for (const [name, id] of Object.entries(list)) {
        const option = document.createElement('option');
        option.textContent = name;
        option.value = id;
        loadSelector.appendChild(option);
    }

    loadButton.onclick = async () => {
        try {
            const id = loadSelector.value;
            await AppMatter.open(id);
        } catch (err) {
            console.error('error opening matter', err);
        }
    }
}