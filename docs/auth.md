client id is app-specific and tied to a home tenant

# multi tenant scenario
client id is known to the app due to home tenancy
it doesnt need tenant id cause it can auth via common
it tries to get access to a sharepoint site
what is it using as a basis for the sharepoint site ?
it needs to look somewhere first
it cant do that based on a user, cause the user isnt signed in yet
it cant do it prompted otherwise it would need to do that everytime
i dont think this works

the major benefit of using a multi tenant app is that it has the same backend
mine does not need a backend, ergo, should be fine to be instances of a single tenant

# single tenant scenario
the app doesn't know anything about itself
it looks for client id and tenant id - where ?
how can i get something dynamic that tells it where to look?


i think i just need to put the ids into something separate that can go with the hosting
in a scenario where i give this app to other people, the most likely way would be giving them a zip with the build files
plus instructions to edit the config.ini or whatever