import * as fs from 'fs';
import * as path from 'path';
import * as OAM from 'office-addin-manifest';
import template from '../manifest.json';

class Manifest {

    public static async convert(json: Object, prod: boolean = false) {
        const manifest = new Manifest(json, prod);
        fs.writeFileSync(manifest._path, manifest._xml);
        const status = await OAM.validateManifest(manifest._path);
        if (!status.isValid) {
            throw new Error('manifest invalid!');
        }
    }

    private _xml: string = "";
    private _indent: number = 1;
    private _domain: string = "https://localhost:3000";
    private _path: string = path.resolve('dist/manifest.xml');

    constructor(json: Object, production: boolean = false) {
        if (production) {
            this._domain = "https://clarkpanagakos.sharepoint.com/taskpane";
        }
        this._xml += '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
        this._xml += '<OfficeApp xmlns="http://schemas.microsoft.com/office/appforoffice/1.1"\n';
        this._xml += '\txmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n';
        this._xml += '\txmlns:bt="http://schemas.microsoft.com/office/officeappbasictypes/1.0"\n';
        this._xml += '\txmlns:ov="http://schemas.microsoft.com/office/taskpaneappversionoverrides" xsi:type="TaskPaneApp">\n';
        this._xml += this.iterate(json);
        this._xml += "</OfficeApp>";
    }

    public get tabs(): string {
        return '\t'.repeat(this._indent);
    }

    public iterate(json: Object, xml: string = ""): string {
        Object.entries(json).forEach(([key, value]) => {
            if (!value.ATT) {
                xml += this.tabs + "<" + key.split('|')[0];
                if (typeof value === 'object') { 
                    Object.entries<any>(value).forEach(([subK,subV]) => { 
                        if (subV.ATT && subK !== "SCT") {
                            xml += ` ${subK.split('|')[0]}="${subV.VAL.replace("%APPDOMAIN%",this._domain)}"`;
                        }
                    });
                    if (value.SCT && value.SCT.VAL) { 
                        xml += "/";
                    }
                }
                xml += ">";
                if (typeof value === 'object') {
                    xml += "\n";
                    this._indent++;
                    xml = this.iterate(value,xml);
                    this._indent--;
                    if (!value.SCT) {
                        xml += this.tabs + "</" + key.split('|')[0] + ">\n";
                    }
                } else {
                    xml += `${value.replace("%APPDOMAIN%",this._domain)}</${key.split('|')[0]}>\n`
                }
            }
        });
        return xml;
    }

}

Manifest.convert(template);