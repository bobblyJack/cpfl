# WIP
create basic UI
use app folder also to cache partially finished files
change login style from popup to redirect ?
    or just add as fallback state in case popup is blocked

make 3 modes, with different screen sizes... Browser, Taskpane, Mobile.
navigation and page elements therefore need to be mode specific!

I could literally implement Actionstep's API ??? Needs API Credentials though.
Alternatively, perhaps accept an export of data from AS to start the client file ?

could tidy up some overuse of imports by making type declarations in types for more things
in particular class objects seems useful.
i am finally seeing the value in interfaces!

# styles
the style flips at a certain point because the global css is applied immediately but the mode specific stuff is only applied on app instancing. need to figure out whether it would be better to handle styling differently, or alternatively style the loading page in "global" so that it looks ok before the mode stuff is applied. probably further evidence for clearing the taskpane html entirely when the app is instanced tbh.

# icons
iconify-icon ? the carbon set looked ok.
imports as a dependency and then can be bundled.
seems decent.
i do need to think UI at some point.

## idea
migrate balance sheet into app ?
    would require access to actionstep data ? maybe not. just names i guess ?
    could key a file id in and save stuff locally based on that ?

# to do
tidy this up.
need to sort out selecting a client matter and saving/loading that before i can handle the balance sheet.
so active matter first
then balance sheet

- move the user part of authuser to usr page as properties there.

# matter page WIP -
## creating / updating / saving the json file

## whenever there is a change made to the active matter...
wait for maybe 30 seconds to make sure they are done updating it
then update the file on the cloud

## another thought
use localStorage as a cache, run updates to the cloud far less frequently, 5 minutes at min
when app opens, check localStorage for an active matter, and load that
closing out of a matter properly clears the localStorage
this means that the app crashing gives some protection through regular small auto-saves

## what are the flags doing ?
warn: no active matter selected
hint: there is something loaded that isn't currently saved to the cloud