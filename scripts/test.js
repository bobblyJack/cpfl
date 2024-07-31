const { exec } = require('child_process');
const outs = require('../lib/exec-out');

exec('echo testing testing', outs);