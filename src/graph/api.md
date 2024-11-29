now that i am expanding through the use of approot and me/approot, i need to expand the possible urls needed.
what are all the possible graph api calls i need to be able to handle?
let's find out.

// GET me/drive/special/approot (user-specific)
// GET sites/{site-id}/drive/special/approot (non-user specific, not shared to users)
// GET sites/{site-id}/drive/root/delta?$filter=(name ne 'Apps') (library) (hide the Apps folder though)