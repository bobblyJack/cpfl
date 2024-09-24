const stdout = document.getElementById('stdout');
if (!stdout) {
    throw new Error('HTML Body Missing');
}

const head = document.createElement('h1');
head.id = 'main-head';
stdout.appendChild(head);

const body = document.createElement('div');
body.id = 'main-body';
stdout.appendChild(body);

export default {
    head, 
    body
}