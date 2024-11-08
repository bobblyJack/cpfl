# creating / updating / saving the json file

## whenever there is a change made to the active matter...
wait for maybe 30 seconds to make sure they are done updating it
then update the file on the cloud

## another thought
use localStorage as a cache, run updates to the cloud far less frequently, 5 minutes at min
when app opens, check localStorage for an active matter, and load that
closing out of a matter properly clears the localStorage
this means that the app crashing gives some protection through regular small auto-saves

## what are the warning lights doing ?
there is something loaded that isn't currently saved to the cloud
that is the only thing to flag