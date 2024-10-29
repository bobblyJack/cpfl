import './global.css';
import '../icons';
import './taskpane.css';
import './browser.css';
import './mobile.css';

// use .taskpane, .browser, and .mobile on the body element to control host specific css
// eg, instead of main .classA #id1, use .taskpane main .classA #id1

export async function setStyles(env: "taskpane" | "browser" | "mobile") {
    for (const host of typeof env) {
        if (host === env) {
            document.body.classList.add(env);
        } else {
            document.body.classList.remove(env);
        }
    }
}