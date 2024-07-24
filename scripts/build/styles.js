// consider using this to add critical styles in-line into the html
// in the meantime...

const fs = require('fs');

fs.copyFileSync('src/styles.css','dist/styles.css');