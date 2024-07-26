ok i think i am getting the hang of the whole thing.

# to do
make this an index doc with links to readmes in subdirectories
add a git script

# references
https://github.com/OfficeDev/generator-office
https://github.com/OfficeDev/Office-Addin-TaskPane-SSO
https://github.com/OfficeDev/Office-Addin-Scripts

# manifest json logic
mark attributes with <key>: "attribute": {"ATT"=true, "VAL"=<value>}
mark self closing tags as an "SCT" attribute with a true value.
mark repeaters using arrays
use %APPDOMAIN% to sub in localhost / prod env url
keep the initial OfficeApp k:v in the js script itself

# considerations
- @microsoft/office-js is the office-js package if i need static files for some reason instead of the html CDN
- i could change some scripts into global binaries (.bin) which if placed at %PATH% can be run without needing npm/npx/node
- i could look into using jquery (and @types/jquery) for potentially easier html traversal