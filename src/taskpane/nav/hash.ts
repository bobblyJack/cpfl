/*
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
}; */

window.onload = hashload;
window.onhashchange = hashload;

function hashload() {
    const path = window.location.hash; // "#/dashboard" "#/balance"
    switch (path) {
        // page specific loads
    }

}

class HashPages {
    async init() {
        
    }
    get hash() {
        
    }
    set hash(page: string) {
        
    }
}

