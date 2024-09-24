const stderr = document.getElementById('stderr') as HTMLDivElement;
if (!stderr) {
    throw new Error('HTML Body Missing');
}

function clear() {
    for (const child of Array.from(stderr.children)) {
        child.remove();
    }
}

function log(msg: string) {
    const para = document.createElement('p');
    para.textContent = msg;
    stderr.appendChild(para);
}

export default {
    clear, 
    log
}