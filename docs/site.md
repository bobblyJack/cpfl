first use get call:

https://graph.microsoft.com/v1.0/sites/{host-name}:/{server-relative-path}

to get the id

(example: GET https://graph.microsoft.com/v1.0/sites/contoso.sharepoint.com:/sites/sales )

then use client id (app id) + the site id to assign permission

POST https://graph.microsoft.com/v1.0/sites/{site-id}/permissions
Content-Type: application/json
Authorization: Bearer {token}

{
  "roles": ["fullControl"],
  "grantedToIdentities": [
    {
      "application": {
        "id": "{app-id}"
      }
    }
  ]
}

the app needs Sites.Selected with admin consent granted
the auth token requires Sites.Manage.All or Sites.FullControl.All 

# app flowchart
1. set up app in azure and grant admin consent
2. set up taskpane site
3. sign in as admin user
    requires differentiating between user / admin
4. app checks for config, if not found:
5. prompt for taskpane site url
6. get auth token with Sites.Manage.All
7. use site url and auth token to get site id
8. make post request to give app permissions

app can now access its site and the drive within without needing a user.
means it wont need User.Read or Files.Read.All