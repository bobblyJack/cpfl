// custom typescript compiler

const { exec } = require('node:child_process');

exec('npx tsc', (error, stdout, stderr) => {
    
    if (error) {
        console.error(`exec error: ${error}`);
        process.exitCode = 2;
        return;
      }
    
      if (stderr) {
        const lines = stderr.split('\n');
        lines.forEach(line => {
          if (line.startsWith('warning:')) {
            console.warn(`script ${line}`);
          } else {
            console.error(`script ${line}`);
            process.exitCode = 3;
          }
        });
        return;
      }
      
      console.log(`output: ${stdout}`);

});