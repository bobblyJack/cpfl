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

// build helper
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
async function start() {
    // use dev-certs to self-sign
    const certs = await devCerts.getHttpsServerOptions();

    // set default headers
    const headers = {
        'Content-Type': mime.types[""],
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Expires': '-1',
        'Pragma': 'no-cache'
    }

    // define server behaviour
    const server = https.createServer(certs, (req, res) => {
        const url = path.join(dist, req.url === '/' ? home : req.url);
        const ext = mime.types[(path.extname(url))];

        // handle status routing
        if (req.url === '/status') {
            res.writeHead(200, {
                ...headers,
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify({status: 'dev server is running'}));
        
        // serve directory files
        } else {
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    res.writeHead(404, {
                        ...headers,
                        'Content-Type': 'text/plain'
                    });
                    res.end('File not found');
                } else {
                    res.writeHead(200, {
                        ...headers,
                        'Content-Type': ext
                    });
                    res.end(data);
                }
            });
        }
    });

    // start server
    server.listen(port, () => {
        console.log(`https server is running at https://localhost:${port}`);
    });

    // Watch for changes in the src directory
    fs.watch(src, { recursive: true }, (eventType, filename) => {
    console.log(`file changed: ${filename}`);
    rebuild(); // Run build task on file change
    });

}

start();