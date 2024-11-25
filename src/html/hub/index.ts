import CPFL from '../..';
import { HeadPage } from '../main';
import './hub.css';

export default async function (app: CPFL) {
    return new HeadPage("hub", `Welcome ${app.user.name.given}`);
}