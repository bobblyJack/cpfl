import * as https from 'https';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as OADC from 'office-addin-dev-certs';
import env from '../env';
import {getMime} from './mime';
import {httpError} from './errors';

OADC.getHttpsServerOptions().then((certs) => { // get dev certs
    https.createServer(certs, async (req, res) => { // define server behaviour

        let responseBody: any;
        let filePath: string = "";

        try { // parse requested url and define response
            const url = new URL(`https://${env.domain}${req.url || '/'}`);

            res.setHeader('Content-Type', 'text/plain'); // set header defaults
            if (env.dev || url.pathname === "/auth") {
                res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
                res.setHeader('Expires', -1);
                res.setHeader('Pragma', 'no-cache');
            } else {
                res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            }

            switch (url.pathname) { // switch for specific urls
                case '/status': {
                    responseBody = 'cpfl office add-in server running ok';
                    break;
                }

                /* figure out how to do auth stuff.
                case '/auth': {
                    res.setHeader('Content-Type', 'application/json');
                    res.setHeader('Accept', 'application/json');
                    
                    get accessToken, then
                    res.setHeader('Authorization', `Bearer ${accessToken}`);
                    responseBody = json; <- use fetch to get this (might need to install node-fetch)
                    it's middle-tier because the server works as an intermediary
                    the req needs to go through validateJWT
                    the res needs to go through getuserdata
                    
                    break;
                }
                */

                case '/': { // default to static files
                    filePath = path.join(env.dir, 'taskpane.html');
                }
                default: { 
                    if (!filePath) {
                        filePath = path.join(env.dir, url.pathname);
                    }
                    res.setHeader('Content-Type', getMime(path.extname(filePath)));
                    responseBody = await fs.readFile(filePath);
                }
            }

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
        
    }).listen(env.port, () => { // start server
        console.log(`Listening on port ${env.port}`);
    });
});