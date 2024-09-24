import env from '../env';

export async function log(msg: string) {
    if (env.dev) {
        await fetch('/console?log=' + encodeURIComponent(msg));
    } else {
        console.log(msg);
    }
}