# WIP
make sure my eventual point can be run entirely from azure + sharepoint.
the key is to get away from anything that requires the server.
jsons can be hosted in onedrive, for example
however, i'd need a way to read/write to them from the browser i guess.
app roles can be created which will handle admin / user access! that's one thing
otherwise, i guess i could just fetch names every time and not store that anywhere?
yeah. well, other than in localStorage obviously.
that works. that way i don't even need to do any storage.
the other thing is getting away from jwks / jwt to something browser based
jose is an option, or switch to msal-browser.
the other thing to note is how to switch my azure rego from localhost.
app id URI doesn't have to be a url, just needs to be unique to the app (so api://{client ID} is fine i think)
i think i'd ideally like to switch completely away from needing a live app service and towards a static page
i cannot host the html from sharepoint as it is not publicly available
there would be a feedback loop of auth required
check out azure hosting and the vs code plugin.

# LG. user id
oid: 7d3223ad-e122-4fff-ab5a-a7c3c48957c1

# hash fragments
can use an anchor element with a hash in the href attribute to scoll to the corresponding id on the same page automatically
<a href="#section1">Go to Section 1</a>

<h2 id="section1">Section 1</h2>
<p>This is the content of Section 1.</p>

alternatively can use it to manage application state for a SPA. e.g. example.com/#/dashboard is saying that it is showing the dashboard view, /dashboard doesn't actually correspond to a file, the "path" is just a fragment after the hash.

// When the user navigates to a different section
function navigateTo(section) {
    window.location.hash = section; // Set the hash to the section name
}

// On load, check the hash and display the corresponding section
window.onload = function() {
    const section = window.location.hash.substring(1); // Get the hash without the '#'
    if (section) {
        // Logic to show the specific section based on the hash
        showSection(section);
    }
};

window.onhashchange = function() {
    const section = window.location.hash.substring(1);
    loadContent(section); // Load content based on the section
};

# http methods (might not use an API tbh)
// http methods to handle:
// get
// post
// patch
// put
// delete
// head
// options
// trace