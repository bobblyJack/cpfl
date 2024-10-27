import './styles';
import CPFL from './app';

let appReady = false;

try { // loading page
    const main = document.getElementById("app-main");
    let i = 0;
    if (!main) {
        throw new Error('DOM null error');
    }
    const loader = setInterval(() => {
        if (appReady) {
            clearInterval(loader);
        } else {
            i++;
            console.log(`${i} mississippi`);
            main.innerText += ".";
        }
    }, 1000);
} catch (err) {
    console.error(err);
}

Office.onReady((info) => {
    CPFL.start(info).then((app) => {
        appReady = true;
        
    });
});