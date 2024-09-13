import html from './html/elements';
import * as events from './events';

Office.onReady((info) => {
    if (info.host === Office.HostType.Word) {
        html.errors.toggle();
        events.listen();
    }
});
