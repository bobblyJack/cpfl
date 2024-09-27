import * as router from '../../router';

export async function refresh() {

    Array.from(document.body.children).forEach(child => {
        document.body.removeChild(child);
    });

    const username = await router.getUsername();
    const msg = `Welcome ${username.slice(0, username.indexOf(" "))}`
    
    const header = document.createElement('h1');
    header.id = 'main-header';
    header.textContent = msg;
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

}