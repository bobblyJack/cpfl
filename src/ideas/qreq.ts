/**
 * cache and queue handler for requested promises
 * @wip could this function like req / res in a http server to control 
 * @wip error handling
 */
export default class QueueRequest<T> {

    private static order: QueueRequest<any>[] = [];
    private static buffer: NodeJS.Timeout | null = null;

    private req: () => Promise<T>;
    private res: Promise<T>;

    public constructor(req: () => Promise<T>) {
        this.req = req;

        if (QueueRequest.buffer === null) {

            QueueRequest.buffer = setTimeout(() => { // start buffer
                QueueRequest.buffer = null;
            }, 300); // how long to buffer between requests
            
            QueueRequest.order.push(this); // add to queue

            this.res = new Promise<T>((resolve) => { // init response
                const check = setInterval(() => {
                    if (QueueRequest.order[0] === this) { // if first in queue
                        this.res = this.req().then(val => { // call request
                            this.res = Promise.resolve(val); // cache value
                            QueueRequest.order.shift(); // update queue
                            return this.res;
                        });
                        clearInterval(check);
                        resolve(this.res);
                    }
                }, 50); // how frequently to check progress
            });

        } else {
            throw new Error('request queue buffering');
        }

    }

    public get result(): Promise<T> {
        return this.res;
    }

}

/* notes from chat GPT
some interesting ideas in here
except, it thought i wanted to defer starting the promise from resolving, which i didn't
but maybe that is something i should consider...

export default class QueueRequest<T> {

    private static order: QueueRequest<any>[] = [];
    private static buffer: NodeJS.Timeout | null = null;

    private req: () => Promise<T>;
    private res: Promise<T> | null = null; // Defer initialization

    public constructor(req: () => Promise<T>) {
        this.req = req;

        if (QueueRequest.buffer === null) {
            // Start buffer and add to queue
            QueueRequest.buffer = setTimeout(() => {
                QueueRequest.buffer = null;
            }, 300);

            QueueRequest.order.push(this);
        } else {
            // Simply add to queue without throwing an error
            QueueRequest.order.push(this);
        }
    }

    public get result(): Promise<T> {
        if (!this.res) {
            this.res = new Promise<T>((resolve, reject) => {
                const processRequest = async () => {
                    if (QueueRequest.order[0] === this) {
                        try {
                            const result = await this.req();
                            QueueRequest.order.shift(); // Remove completed request from the queue
                            resolve(result);
                        } catch (error) {
                            reject(error);
                        }
                        // Process next item in the queue if it exists
                        if (QueueRequest.order.length > 0) {
                            QueueRequest.order[0].result;
                        }
                    } else {
                        // Retry until this request reaches the front
                        setTimeout(processRequest, 50);
                    }
                };
                processRequest();
            });
        }
        return this.res;
    }
}

*/

// use setTimeout recursively with a variable ms timer. start at 1ms, then i++ until it gets to 1000 or so,
// or alternatively double itself every time perhaps.
// could also use bitwise operators to handle the doubling.