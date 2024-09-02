import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';
import * as devCerts from 'office-addin-dev-certs';

const port: number = 3000;
const dir: string = path.resolve('dist');
const home: string = "index.html";

function mime(ext: string) {
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

// start server function
(async () => {
    // use dev-certs to self-sign
    const certs = await devCerts.getHttpsServerOptions();

    // define server behaviour
    const server = https.createServer(certs, (req, res) => {
        
        const url = req.url && req.url !== "/" ? path.join(dir, req.url) : path.join(dir, home);
        const ext = mime(path.extname(url));

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
})();