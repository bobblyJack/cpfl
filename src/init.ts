import html from './html';
import * as events from './events';

Office.onReady((info) => {
    if (info.host === Office.HostType.Word) {
        html.errors.toggle();
        events.listen();
    }
});