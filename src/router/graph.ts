/* https:graph.microsoft.com/v1.0
 requires auth header

 to get to the taskpane site on sharepoint ->
 sites/root/drives/{taskpane-ID}/
 ID: b!sZigh2uhLkm81En6bkEH0c-dYK-8B61EljQC5ygtekif7QwnUqswTLKnsBFEkAKV

 don't even need to go through the sites part, can just get the drive id. easyyyy.

 to then get to the files
 sites/root/drives/{taskpane-ID}/root/children
 can use this to map a json of exactly what i need to store (which is likely just names and IDs)
 ?$select=name,id

 theeeen you can replace root/children with items/{item-ID}/content to download the file.
 neat!

 wait, one more thing...
 app needs to select the @microsoft.graph.downloadUrl property as well, which returns the same url that /content points to
 this url can be requested directly cause it gets past CORS.

 so ?$select=name,id,@microsoft.graph.downloadUrl

i think i can actually just grab a 1 time map of the available files when i log on ???
do i even need a middle-tier server ???
i guess it depends how hard the OBO thing is.
but, hypothetically, i just auth using the token when they log in, then i grab a map of download urls
then with a map i can fetch from within the browser rather than needing to route to server ???

*/
async function getFile() {
    const file = await fetch('downloadUrl');
    const blob = await file.blob();

    // the following is from GPT - it is a way to get the file from the server by adding a download link. neat!

    const urlObject = window.URL.createObjectURL(blob); // Create a temporary URL for the file

    // Create a link element to trigger the file download
    const a = document.createElement('a');
    a.href = urlObject;
    a.download = 'downloaded_file'; // You can customize the filename
    document.body.appendChild(a);
    a.click();

    // Clean up
    window.URL.revokeObjectURL(urlObject);
    document.body.removeChild(a);

}

// the GPT script creates an invisible link which it clicks for you and then automatically removes
// it needs to do this so that the browser actually handles the download, i think.
// although, apparently modern browsers don't even require this to be appended