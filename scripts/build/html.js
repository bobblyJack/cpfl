// if html becomes modular, will need to think about bundling (or hybrid bundling idk)
// in the meantime...

const fs = require('fs');

fs.copyFileSync('src/index.html','dist/index.html');