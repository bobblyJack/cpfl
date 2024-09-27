import * as https from 'https';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as OADC from 'office-addin-dev-certs';
import {getMime} from './mime';
import {httpError} from './errors';

const port: number = 3000;
const host: string = `https://localhost:${port}`;

OADC.getHttpsServerOptions().then((certs) => { // get dev certs
    https.createServer(certs, async (req, res) => { // define server behaviour

        let responseBody: string | Buffer;
        let filePath: string = "";

        try { // parse requested url and define response
            const url = new URL(`${host}${req.url || '/'}`);

            res.setHeader('Content-Type', 'text/plain'); // set header defaults
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            res.setHeader('Expires', -1);
            res.setHeader('Pragma', 'no-cache');

            if (url.pathname === "/") { // set index file path
                filePath = path.join('dist', 'taskpane.html');
            } else {
                filePath = path.join('dist', url.pathname);
            }

            res.setHeader('Content-Type', getMime(path.extname(filePath)));
            responseBody = await fs.readFile(filePath); // get file data

        } catch (err) { // parse caught errors
            const httpErr = httpError(err);
            res.statusCode = httpErr.code;
            responseBody = httpErr.msg;
        }

        if (res.statusCode === 200 && // unknown extension error
            path.extname(filePath) !== '' &&
            res.getHeader('Content-Type') === 'application/octet-stream') {
            res.statusCode = 415;
        }

        res.end(responseBody); // send response
        
    }).listen(port, () => { // start server
        console.log(`Listening on port ${port}`);
    });
});