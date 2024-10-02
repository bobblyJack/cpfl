export function refresh() {

    Array.from(document.body.children).forEach(child => {
        document.body.removeChild(child);
    });

    const header = document.createElement("h1");
    header.id = 'app-header';
    header.textContent = "Welcome ";
    document.body.appendChild(header);
    
    const body = document.createElement("main");
    body.id = 'app-body';
    document.body.appendChild(body);

    const console = document.createElement("div");
    console.id = 'app-console';
    console.classList.add('light');
    console.classList.add('small');
    document.body.appendChild(console);

    const log = document.createElement("p");
    log.textContent = "Taskpane Refreshed";
    console.appendChild(log);
    setTimeout(() => {
        log.remove();
    }, 6000);

}