/**
 * cache and queue handler for requested promises
 */
export default class QueueRequest<T> {

    private static queue: QueueRequest<any>[] = []; // the queue
    private static async process<T>(qreq: QueueRequest<T>, timer: number = 1) {
        let strikes = 0;
        return new Promise<T>((resolve, reject) => {
            async function procTimeout() {
                try {
                    if (QueueRequest.queue[0] === qreq) {
                        qreq.res = qreq.req().then((val) => {
                            qreq.res = Promise.resolve(val);
                            QueueRequest.queue.shift();
                            return val;
                        });
                        resolve(qreq.res);
                    } else {
                        if (timer <= 1024) {
                            timer = timer << 1;
                        } else {
                            strikes++;
                            if (strikes >= 3) {
                                throw new Error('qreq stalled');
                            }
                        }
                        setTimeout(procTimeout, timer);
                    }
                } catch (err) {
                    reject(err);
                }
            }
            procTimeout();
        });
    }

    private req: () => Promise<T>;
    private res: Promise<T>;

    public constructor(req: () => Promise<T>) {

        this.req = req;
        QueueRequest.queue.push(this);
        this.res = QueueRequest.process(this);

    }

    public get result(): Promise<T> {
        return this.res;
    }

}