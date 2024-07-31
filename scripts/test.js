const { exec } = require('child_process');
const outs = require('../lib/exec-out');

exec('npx office-addin-debugging start dist/manifest.xml --no-debug', outs);