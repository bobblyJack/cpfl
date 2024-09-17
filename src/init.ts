import html from './html/elements';
import * as events from './events';
import './html/index.html';
import './html/styles/styles.css';

Office.onReady((info) => {
    if (info.host === Office.HostType.Word) {
        html.errors.toggle();
        events.listen();
    }
});