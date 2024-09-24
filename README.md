# to do:
- once auth is working add some admin controls that show up if i am logged in
- test fallback auth, possibly just remove it altogether and rely on native sso
- consider migrating azure manifest to org only instead of common ?
- fetch a precedent template, maybe start with the letterhead

# LG. user id
oid: 7d3223ad-e122-4fff-ab5a-a7c3c48957c1

# user settings
- set up a json with the following format
{
    oid: {
        upn: preferred_username
        access: admin / user
        ...etc
    },
    oid: {
        user number 2
    }, and so on
}