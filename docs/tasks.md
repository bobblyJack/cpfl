options in tasks.json

{
    "type": "shell", // shell runs in whatever the terminal shell is

    "command": "echo example --Arg argument1 -a argument 2",

    "options": {
        "shell": { 
            // Configures the shell to use for executing the command
            "executable": "powershell.exe",
            "args": ["-NoProfile", "-Command"],

            // specifies the working directory for the task
            "cwd": "${workspaceFolder}/src",

            // defines environment variables to be set for the task
                    "env": {
                        "NODE_ENV": "production"
                        }
        }
    }
}

tasks in vs code can be automated better within that environment, but are not lightweight / cross-platform like npm scripts.

