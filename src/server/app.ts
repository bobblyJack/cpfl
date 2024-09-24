import * as https from 'https';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as OADC from 'office-addin-dev-certs';
import env from '../env';
import {verifyToken} from './token';
import {getMime} from './mime';
import {httpError} from './errors';

const dir = 'dist'; // define dev build directory

OADC.getHttpsServerOptions().then((certs) => { // get dev certs
    https.createServer(certs, async (req, res) => { // define server behaviour

        let responseBody: string | Buffer;
        let filePath: string = "";

        try { // parse requested url and define response
            const url = new URL(`${env.domain}${req.url || '/'}`);

            res.setHeader('Content-Type', 'text/plain'); // set header defaults
            if (env.dev || url.pathname.includes('auth')) {
                res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
                res.setHeader('Expires', -1);
                res.setHeader('Pragma', 'no-cache');
            } else {
                res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            }

            switch (url.pathname) { // switch for specific urls

                case '/console': { // console & status
                    responseBody = 'tweet tweet';
                    console.log(url.searchParams.get('log'));
                    break;
                }

                case '/auth': { // authorisation
                    // split method of get / post rather than using queried login ?
                    if (!req.headers.authorization) {
                        throw new Error('authorisation header missing')
                    }
                    res.setHeader('Content-Type', 'application/json');
                    const token = req.headers.authorization.split(" ")[1];
                    
                    const payload = await verifyToken(token);
                    responseBody = JSON.stringify(payload);

                    /*const queries = url.searchParams;
                    if (queries.has('login')) { // simple id

                        // store some amount of profile data somewhere? 

                    } else { // parse queries

                        const scopes = payload.scp.split(" ")
                        res.setHeader('Accept', 'application/json');
                        
                    }*/
                    break;
                }

                case '/': { // set home to app page
                    filePath = path.join(dir, 'taskpane.html');
                }
                default: { // default to static files
                    if (!filePath) {
                        filePath = path.join(dir, url.pathname);
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