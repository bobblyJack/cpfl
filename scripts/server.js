const https = require('https');
const fs = require('fs');
const path = require('path');
const devCerts = require('office-addin-dev-certs');
const mime = require('../lib/mimes');
const { exec } = require('child_process');

const port = 3000;
const src = path.resolve('src');
const dist = path.resolve('dist');
const home = "index.html";

// build helper (for live rebuilding)
async function rebuild() {
    try {
        exec('npm run build -- debug');
        console.log('directory rebuilt')
        return;
    } catch (e) {
        if (e instanceof Error) {
            console.error(e.message);
        } else {
            console.error('unknown error caught');
        }
        throw e;
    }
};

// start server function
(async () => {
    // use dev-certs to self-sign
    const certs = await devCerts.getHttpsServerOptions();

    // define server behaviour
    const server = https.createServer(certs, (req, res) => {
        const url = path.join(dist, req.url === '/' ? home : req.url);
        const ext = mime.types[(path.extname(url))];

        // set headers
        const header = {
            'Content-Type': 'text/plain',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Expires': '-1',
            'Pragma': 'no-cache'
        }

        // handle status routing
        if (req.url === '/status') {
            res.writeHead(200, header);
            res.end('dev server is running ok');
        
        // serve directory files
        } else {
            fs.readFile(url, (err, data) => {
                if (err) {
                    if (err.code === 'ENOENT') {
                        // file not found
                        res.writeHead(404, header);
                        res.end('file not found');
                    } else {
                        // other server errors
                        res.writeHead(500, header);
                        res.end('internal server error');
                    }
                } else if (!ext) {
                    // unsupported mime
                    res.writeHead(415, header);
                    res.end('unsupported media type');
                } else {
                    res.writeHead(200, {
                        ...header,
                        'Content-Type': ext
                    });
                    res.end(data);
                }
            });
        }
    });
    // start server on port
    server.listen(port, () => {
        console.log(`https server is running at https://localhost:${port}`);
    });
    // watch for changes in the src directory
    fs.watch(src, { recursive: true }, (eventType, filename) => {
        console.log(`${eventType} detected on ${filename}`);
        rebuild(); // Run build task on file change
    });
})();