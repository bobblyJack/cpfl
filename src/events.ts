import html from './html';
import {main} from './main';

export function listen() {
    html.buttons.run.onClick(() => Word.run(main));
}