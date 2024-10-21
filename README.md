# WIP
create basic UI
use app folder also to cache partially finished files
change login style from popup to redirect ?
    or just add as fallback state in case popup is blocked

I could literally implement Actionstep's API ??? Needs API Credentials though.
Alternatively, perhaps accept an export of data from AS to start the client file ?

# icons
iconify-icon ? the carbon set looked ok.
imports as a dependency and then can be bundled.
seems decent.
i do need to think UI at some point.

## idea
migrate balance sheet into app ?
    would require access to actionstep data ? maybe not. just names i guess ?
    could key a file id in and save stuff locally based on that ?

# production steps - to do when publishing
- change app ID URI to prod host
- if ever deployed on different tenant, they can change config.json to their values

# hash fragments
can use an anchor element with a hash in the href attribute to scroll to the corresponding id on the same page automatically
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