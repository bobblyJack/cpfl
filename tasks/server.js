const https = require('https');
const fs = require('fs');
const path = require('path');
const OADC = require('office-addin-dev-certs');

const port = 3000; // dev server port

OADC.getHttpsServerOptions().then((certs) => {
    https.createServer(certs, (req, res) => {
        const url = new URL('https://localhost:' + port.toString() + req.url || '');
        const file = path.join('dist', url.pathname === '/' ? 'taskpane.html' : url.pathname);
        const ext = mime(path.extname(file));
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
        
        } else { // serve directory files
            fs.readFile(file, (err, data) => {
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
    }).listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
});

function mime(ext) {
    switch (ext) {
        // text
        case ".html": return "text/html";
        case ".css": return "text/css";
        case ".ts": return "text/plain";
        case ".txt": return "text/plain";
        // apps
        case ".js": return "application/javascript";
        case ".json": return "application/json";
        case ".map": return "application/json";
        case ".xml": return "application/xml";
        // images
        case ".png": return "image/png";
        case ".jpg": return "image/jpeg";
        case ".gif": return "image/gif";
        case ".ico": return "image/x-icon";
        // fonts
        case ".ttf": return "font/ttf";
        // otherwise
        default: return "application/octet-stream";
    }
}