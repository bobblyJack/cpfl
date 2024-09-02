$paths = "./lib/", "./dist/"
Remove-Item -Path $paths -Recurse -Force
New-Item -Path $paths -ItemType Directory -Force