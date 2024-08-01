ok i think i am getting the hang of the whole thing.

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

# enums and switch cases
- **Enum**: Defines a set of named constants in TypeScript for improved readability and type safety.

- **Switch**: A control flow statement that executes code blocks based on an expression's value. It uses `case` for each value and `break` to terminate each block, with `default` for unmatched values. Offers an alternative to multiple 'if-else' statements.