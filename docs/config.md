app storage

# app-specific
hosted with the app if they can be client facing, so static files and scripts on github page at the moment
non-client facing would mean running a server or subscribing to a cloud server, avoid that.
static only means read-only. everything app specific is read-only.

# tenant-specific
this should ideally be a sharepoint site that the app is granted access to, i think.
at the moment i think i have a drive within a site, which is not quite right ?
explore what sites i have set up and how they relate to drives
it just needs to be a drive, and the app needs access to it.
it could prompt for it and save it somewhere? 

i think creating a site and then accessing via:
https://graph.microsoft.com/v1.0/sites/{host-name}:/{server-relative-path}
makes the most sense


# user-specific
user specific files should just be in the special app folder
this is user settings, and perhaps temp files as well like if someone wanted to save where they are up to ?


## permissions
App-wide: openid + profile (in manifest)
Delegated: Files.ReadWrite.AppFolder
Application: Sites.Selected

## admin users need
Sites.Manage.All