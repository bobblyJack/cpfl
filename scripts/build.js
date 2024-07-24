// npm run build -- local/prod
// (default to local)

require('./build/clean');
require('./build/manifest');
require('./build/typescript');
require('./build/html');
require('./build/styles');
require('./build/assets');