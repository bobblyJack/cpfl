import * as fs from 'fs';
import * as path from 'path';
import * as OAM from 'office-addin-manifest';

const template = {
    "Id": "7b69c0f2-8a56-4d29-ae3e-9056390fdb6b",
    "Version": "1.0.0",
    "ProviderName": "CPFL",
    "DefaultLocale": "en-AU",
    "DisplayName": {
      "DefaultValue": {"ATT": true, "VAL": "CPFL App"},
      "SCT": {"ATT":true, "VAL":true}
    },
    "Description": {
      "DefaultValue": {"ATT": true, "VAL": "An Office Add-In for Precedent Automation"},
      "SCT": {"ATT":true, "VAL":true}
    },
    "IconUrl": {
      "DefaultValue": {"ATT": true, "VAL": "%APPDOMAIN%/images/icon-32.png"},
      "SCT": {"ATT":true, "VAL":true}
    },
    "HighResolutionIconUrl": {
      "DefaultValue": {"ATT": true, "VAL": "%APPDOMAIN%/images/icon-128.png"},
      "SCT": {"ATT":true, "VAL":true}
    },
    "SupportUrl": {
      "DefaultValue": {"ATT": true, "VAL": "https://clarkpanagakos.com.au"},
      "SCT": {"ATT":true, "VAL":true}
    },
    "AppDomains": {
      "AppDomain": "https://clarkpanagakos.com.au"
    },
    "Hosts": {
      "Host": {
        "Name": {"ATT": true, "VAL": "Document"},
        "SCT": {"ATT": true, "VAL": true}
      }
    },
    "DefaultSettings": {
      "SourceLocation": {
        "DefaultValue": {"ATT": true, "VAL": "%APPDOMAIN%/taskpane.html"},
        "SCT": {"ATT": true, "VAL": true}
      }
    },
    "Permissions": "ReadWriteDocument",
    "VersionOverrides": {
      "xmlns": {"ATT": true, "VAL": "http://schemas.microsoft.com/office/taskpaneappversionoverrides"},
      "xsi:type": {"ATT": true, "VAL": "VersionOverridesV1_0"},
      "Hosts": {
        "Host": {
          "xsi:type": {"ATT":true, "VAL": "Document"},
          "DesktopFormFactor": {
            "GetStarted": {
              "Title": {
                "resid": {"ATT": true, "VAL": "GetStarted.Title"},
                "SCT": {"ATT": true, "VAL": true}
              },
              "Description": {
                "resid": {"ATT": true, "VAL": "GetStarted.Description"},
                "SCT": {"ATT": true, "VAL": true}
              },
              "LearnMoreUrl": {
                "resid": {"ATT": true, "VAL": "GetStarted.LearnMoreUrl"},
                "SCT": {"ATT": true, "VAL": true}
              }
            },
            "ExtensionPoint": {
              "xsi:type": {"ATT": true, "VAL": "PrimaryCommandSurface"},
              "OfficeTab": {
                "id": {"ATT": true, "VAL": "TabHome"},
                "Group": {
                  "id": {"ATT": true, "VAL": "CommandsGroup"},
                  "Label": {
                    "resid": {"ATT": true, "VAL": "CommandsGroup.Label"},
                    "SCT": {"ATT": true, "VAL": true}
                  },
                  "Icon": {
                    "bt:Image|1": {
                      "size": {"ATT": true, "VAL": "16"},
                      "resid": {"ATT": true, "VAL": "Icon.16x16"},
                      "SCT": {"ATT": true, "VAL": true}
                    },
                    "bt:Image|2": {
                      "size": {"ATT": true, "VAL": "32"},
                      "resid": {"ATT": true, "VAL": "Icon.32x32"},
                      "SCT": {"ATT": true, "VAL": true}
                    },
                    "bt:Image|3": {
                      "size": {"ATT": true, "VAL": "80"},
                      "resid": {"ATT": true, "VAL": "Icon.80x80"},
                      "SCT": {"ATT": true, "VAL": true}
                    }
                  },
                  "Control": {
                    "xsi:type": {"ATT": true, "VAL": "Button"},
                    "id": {"ATT": true, "VAL": "TaskpaneButton"},
                    "Label": {
                      "resid": {"ATT": true, "VAL": "TaskpaneButton.Label"},
                      "SCT": {"ATT": true, "VAL": true}
                    },
                    "Supertip": {
                      "Title": {
                        "resid": {"ATT": true, "VAL": "TaskpaneButton.SupertipTitle"},
                        "SCT": {"ATT": true, "VAL": true}
                      },
                      "Description": {
                        "resid": {"ATT": true, "VAL": "TaskpaneButton.SupertipText"},
                        "SCT": {"ATT": true, "VAL": true}
                      }
                    },
                    "Icon": {
                      "bt:Image|1": {
                        "size": {"ATT": true, "VAL": "16"},
                        "resid": {"ATT": true, "VAL": "Icon.16x16"},
                        "SCT": {"ATT": true, "VAL": true}
                      },
                      "bt:Image|2": {
                        "size": {"ATT": true, "VAL": "32"},
                        "resid": {"ATT": true, "VAL": "Icon.32x32"},
                        "SCT": {"ATT": true, "VAL": true}
                      },
                      "bt:Image|3": {
                        "size": {"ATT": true, "VAL": "80"},
                        "resid": {"ATT": true, "VAL": "Icon.80x80"},
                        "SCT": {"ATT": true, "VAL": true}
                      }
                    },
                    "Action": {
                      "xsi:type": {"ATT":true, "VAL":"ShowTaskpane"},
                      "TaskpaneId": "ButtonId1",
                      "SourceLocation": {
                        "resid": {"ATT":true, "VAL": "Taskpane.Url"},
                        "SCT": {"ATT":true, "VAL": true}
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "Resources": {
        "bt:Images": {
          "bt:Image|1": {
            "id": {"ATT": true, "VAL": "Icon.16x16"},
            "DefaultValue": {"ATT": true, "VAL": "%APPDOMAIN%/images/icon-16.png"},
            "SCT": {"ATT": true, "VAL": true}
          },
          "bt:Image|2": {
            "id": {"ATT": true, "VAL": "Icon.32x32"},
            "DefaultValue": {"ATT": true, "VAL": "%APPDOMAIN%/images/icon-32.png"},
            "SCT": {"ATT": true, "VAL": true}
          },
          "bt:Image|3": {
            "id": {"ATT": true, "VAL": "Icon.80x80"},
            "DefaultValue": {"ATT": true, "VAL": "%APPDOMAIN%/images/icon-80.png"},
            "SCT": {"ATT": true, "VAL": true}
          }
        },
        "bt:Urls": {
          "bt:Url|1": {
            "id": {"ATT": true, "VAL": "GetStarted.LearnMoreUrl"},
            "DefaultValue": {"ATT": true, "VAL": "https://clarkpanagakos.com.au"},
            "SCT": {"ATT": true, "VAL": true}
          },
          "bt:Url|2": {
            "id": {"ATT": true, "VAL": "Taskpane.Url"},
            "DefaultValue": {"ATT": true, "VAL": "%APPDOMAIN%/taskpane.html"},
            "SCT": {"ATT": true, "VAL": true}
          }
        },
        "bt:ShortStrings": {
          "bt:String|1": {
            "id": {"ATT": true, "VAL": "GetStarted.Title"},
            "DefaultValue": {"ATT": true, "VAL": "Get Started"},
            "SCT": {"ATT": true, "VAL": true}
          },
          "bt:String|2": {
            "id": {"ATT": true, "VAL": "CommandsGroup.Label"},
            "DefaultValue": {"ATT": true, "VAL": "CPFL App"},
            "SCT": {"ATT": true, "VAL": true}
          },
          "bt:String|3": {
            "id": {"ATT": true, "VAL": "TaskpaneButton.Label"},
            "DefaultValue": {"ATT": true, "VAL": "CPFL Taskpane"},
            "SCT": {"ATT": true, "VAL": true}
          },
          "bt:String|4": {
            "id": {"ATT": true, "VAL": "TaskpaneButton.SupertipTitle"},
            "DefaultValue": {"ATT": true, "VAL": "Hey there!"},
            "SCT": {"ATT": true, "VAL": true}
          }
        },
        "bt:LongStrings": {
          "bt:String|1": {
            "id": {"ATT": true, "VAL": "GetStarted.Description"},
            "DefaultValue": {"ATT": true, "VAL": "The App loaded successfully. Go to HOME and click the button to get started!"},
            "SCT": {"ATT": true, "VAL": true}
          },
          "bt:String|2": {
            "id": {"ATT": true, "VAL": "TaskpaneButton.Description"},
            "DefaultValue": {"ATT": true, "VAL": "Open the CPFL App"},
            "SCT": {"ATT": true, "VAL": true}
          },
          "bt:String|3": {
            "id": {"ATT": true, "VAL": "TaskpaneButton.SupertipText"},
            "DefaultValue": {"ATT": true, "VAL": "Here is some more text I was missing!"},
            "SCT": {"ATT": true, "VAL": true}
          }
        }
      }
    }
  }

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