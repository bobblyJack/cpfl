import * as router from '../../router';

export async function refresh() {

    Array.from(document.body.children).forEach(child => {
        document.body.removeChild(child);
    });

    const user = await router.auth(); // placeholders
    const msg = `Welcome ${user.name.slice(0, user.name.indexOf(" "))}`
    
    const header = document.createElement('h1');
    header.id = 'main-header';
    header.textContent = msg; // use of placeholder
    document.body.appendChild(header);

    const para = document.createElement('p');
    para.textContent = 'Taskpane Refreshed';
    document.body.appendChild(para);

    setTimeout(() => {
        para.classList.add('light');
        setTimeout(() => {
            para.remove();
        }, 10000);
    }, 10000);

    return user; // further use of placeholder
    // user settings should get stored somewhere else.

}