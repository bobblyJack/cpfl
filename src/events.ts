import html from './html/elements';
import {main} from './main';

export function listen() {
    html.buttons.run.onClick(() => Word.run(main));
}