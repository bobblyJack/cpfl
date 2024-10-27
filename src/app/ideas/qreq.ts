/**
 * cache and queue handler for requested promises
 * @wip error handling
 */
export default class QueueRequest<T> {

    private static order: QueueRequest<any>[] = [];
    private static buffer: NodeJS.Timeout | null = null;

    private req: () => Promise<T>;
    private res: Promise<T>;

    public constructor(req: () => Promise<T>) {

        if (QueueRequest.buffer === null) {

            QueueRequest.buffer = setTimeout(() => {
                QueueRequest.buffer = null;
            }, 300); // how long to buffer between requests
            
            this.req = req;
            QueueRequest.order.push(this);

            this.res = new Promise<T>((resolve) => {
                const check = setInterval(() => {
                    if (QueueRequest.order[0] === this) {
                        this.res = this.req().then(val => {
                            this.res = Promise.resolve(val);
                            QueueRequest.order.shift();
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

