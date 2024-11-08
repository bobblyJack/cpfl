import tables from './main.html';

type TableType = "Assets" | "Liabilities" | "Superannuation";

class WIPBalTable {

    private static tableA: HTMLTableElement;
    private static tableL: HTMLTableElement;
    private static tableS: HTMLTableElement;
    public static open() {
        if (!this.tableA || !this.tableL || !this.tableS) {

        }

    }

    public static close() {

    }

    

    

    

}



function createRow(body: HTMLTableSectionElement) {

    const row = document.createElement("tr");

    for (let i = 0; i < 5; i++) {
        const cell = document.createElement("td");
        switch (i) {
            case 0: {
                const select = createDropDown([
                    ["C", "client"],
                    ["O", "other side"],
                    ["J", "joint"]
                ]);
                cell.appendChild(select);
                break;
            }
            case 1: {
                const input = document.createElement("input");
                input.type = "text";
                
            }
        }
        row.appendChild(cell);
    }

    return body.appendChild(row);

}


/**
 * create a select element with an initial blank selection plus options
 * @param options value, display text
 * @returns html select element
 */
function createDropDown(options: [string, string][]) {
    const select = document.createElement("select");
    const blank = document.createElement("option");
    blank.textContent = "...";
    blank.selected = true;
    select.appendChild(blank);
    for (const option of options) {
        const choice = document.createElement("option");
        if (option[0]) {
            choice.value = option[0];
        }
        choice.textContent = option[1];
        select.appendChild(choice);
    }
    return select;
}