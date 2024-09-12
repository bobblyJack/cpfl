const main = document.getElementsByClassName('stdout');
const stdout: CSSStyleDeclaration[] = []; 
for (let i = 0; i < main.length; i++) {
    const element = main.item(i);
    if (element) {
        const style = window.getComputedStyle(element);
        stdout.push(style);
    }
}

const errors = document.getElementsByClassName('stderr');
const stderr: CSSStyleDeclaration[] = [];
for (let i = 0; i < errors.length; i++) {
    const element = errors.item(i);
    if (element) {
        const style = window.getComputedStyle(element);
        stderr.push(style);
    }
}

export function on() {
    for (const style of stderr) {
        style.display = 'flex';
    }
    for (const style of stdout) {
        style.display = 'none';
    }
}

export function off() {
    for (const style of stderr) {
        style.display = 'none';
    }
    for (const style of stdout) {
        style.display = 'flex';
    }
}