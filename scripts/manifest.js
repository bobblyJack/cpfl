const fs = require('fs');

// get app domain (default local)
let domain = "https://localhost:3000"
if (process.argv.slice(2) === "prod") {
    domain = "https://clarkpanagakos.sharepoint.com/taskpane";
}

// get manifest template
const template = require('../src/manifest.json');

// create recursive JSON to XML converter
function jsonConverter(obj, xml = "", indent = 1) {

    // indentation helper function
    function tabs(stop = 1) {
        return '\t'.repeat(stop)
    }

    // initialise XML
    if (!xml) {
        xml += '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
        xml += '<OfficeApp xmlns="http://schemas.microsoft.com/office/appforoffice/1.1"\n';
        xml += '\txmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n';
        xml += '\txmlns:bt="http://schemas.microsoft.com/office/officeappbasictypes/1.0"\n';
        xml += '\txmlns:ov="http://schemas.microsoft.com/office/taskpaneappversionoverrides" xsi:type="TaskPaneApp">\n';
    }

    // iterate through key:value pairs
    Object.entries(obj).forEach(([key,value]) => {

        // skip attributes
        if (!value.ATT) {

        // create open key tag
        xml += tabs(indent) + "<" + key.split('|')[0];
        // iterate through attributes
        if (typeof value === 'object') {
            Object.entries(value).forEach(([subK,subV]) => {
            if (subV.ATT && subK !== "SCT") {
                xml += ` ${subK.split('|')[0]}="${subV.VAL.replace("%APPDOMAIN%",domain)}"`;
            }
            });
            // then check for self-closing tag
            if (value.SCT && value.SCT.VAL) {
            xml += "/";
            }
        }
        xml += ">";

        // search for nested key:value pairs
        if (typeof value === 'object') {
            xml += "\n";
            indent++;
            xml = jsonConverter(value,xml,indent);
            indent--;
            if (!value.SCT) {
            xml += tabs(indent) + "</" + key.split('|')[0] + ">\n";
            }
        
        // add value and closing key tag
        } else {
            xml += `${value.replace("%APPDOMAIN%",domain)}</${key.split('|')[0]}>\n`
        }
        
        }
    });
    return xml;
}

fs.writeFileSync('dist/manifest.xml',jsonConverter(template) + "</OfficeApp>");
console.log(`manifest created @ ${domain}`);