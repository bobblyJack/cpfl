/**
 * convert err to http status
 * @param err the caught error to parse
 * @returns status code
 * @returns status msg
 */
export function httpError(err: unknown) {
    const nodeErrors = {
        ENOENT: {code: 404, msg: 'file not found'},
        EACCES: {code: 403, msg: 'forbidden path'},
        EISDIR: {code: 400, msg: 'invalid path'}
    }
    let code = 500;
    let msg = 'unknown server error';
    if (err instanceof Error) {
        for (const [key, value] of Object.entries(nodeErrors)) {
            if (err.message.includes(key)) {
                code = value.code;
                msg = value.msg;
            }
        }
    }
    return {code, msg};
}