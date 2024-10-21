const timerProc = 50; // how often to update the queue
const timerCheck = 100; // how frequently to check progress
const timerBuffer = 300; // how long to wait between requests

export class AppRequest {
    private static queue: AppRequest[] = [];
    private static buffer: NodeJS.Timeout | null = null;
    private _isProcessed: boolean = false;

    /**
     * adds req to the queue
     */
    public constructor(req: () => any) {

        if (AppRequest.buffer !== null) { // check buffer
            console.log('app request buffering');
        } else {

            AppRequest.buffer = setTimeout(() => { // start buffer
                AppRequest.buffer = null;
            }, timerBuffer);
    
            waitUntil(timerProc, () => { // start processor
                if (AppRequest.queue[0] === this) {
                    AppRequest.queue.shift();
                    this._isProcessed = true;
                    return true;
                }
                return false;
            }, req)
        }
    }

    /**
     * await request processing
     */
    public get isProcessed(): Promise<boolean> {
        return waitUntil(timerCheck, () => this._isProcessed, () => true);
    }
}

async function waitUntil<T>(check: number, until: () => boolean, then: () => T): Promise<T> {
    return new Promise(resolve => {
        const timer = setInterval(() => {
            if (until()) {
                clearInterval(timer);
                resolve(then());
            }
        }, check);
    });
}