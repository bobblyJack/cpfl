$path = "./dist/"
Write-Output "Building Taskpane..."
Remove-Item -Path $path -Recurse -Force
New-Item -Path $path -ItemType Directory -Force