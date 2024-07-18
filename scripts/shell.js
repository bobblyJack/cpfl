// npm run ps -- <script>

const { exec } = require('node:child_process');

const scriptName = process.argv.slice(2);

if (!scriptName) {
  console.error('no powershell script provided. use "-- <scriptName>" to provide a name');
  process.exitCode = 1;
  return;
}

exec(`powershell -Command "Set-ExecutionPolicy Unrestricted -Scope Process"; powershell -File "./scripts/${scriptName[0]}.ps1"`, (error, stdout, stderr) => {
 
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