// clean up the old build.

const fs = require('fs');
fs.rmSync('dist',{recursive: true});
fs.mkdirSync('dist');