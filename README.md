i should add another launch task that opens it in a browser instead of word

# references
https://github.com/OfficeDev/generator-office
https://github.com/OfficeDev/Office-Addin-TaskPane-SSO
https://github.com/OfficeDev/Office-Addin-Scripts
https://learn.microsoft.com/en-au/office/dev/add-ins/publish/publish-task-pane-and-content-add-ins-to-an-add-in-catalog

# manifest json logic
mark attributes with <key>: "attribute": {"ATT"=true, "VAL"=<value>}
mark self closing tags as an "SCT" attribute with a true value.
mark repeaters using arrays
use %APPDOMAIN% to sub in localhost / prod env url
keep the initial OfficeApp k:v in the js script itself

# considerations
- @microsoft/office-js is the office-js package if i need static files for some reason instead of the html CDN
- i could look into using jquery (and @types/jquery) for potentially easier html traversal