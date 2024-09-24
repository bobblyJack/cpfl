import app from './html';
import router from './router';

Office.onReady((info) => {
    if (info.host === Office.HostType.Word) {
        app.console.clear();
        router.log('Accessing 365...');
        init();
    } else {
        app.console.log('Office Host Error');
    }
});

async function init() {
    
    const user = await router.auth.login();
    router.log('Access Granted. Signed on as ' + user.name);
    app.main.head.textContent = `Welcome ${user.name.slice(0, user.name.indexOf(" "))}`;

    Word.run((context) => {
        for (const [key, value] of Object.entries(user)) {
            let msg = `${key}: ${value}`;
            context.document.body.insertParagraph(msg, Word.InsertLocation.end);
        }
        return context.sync();
    });

    const reminder = document.createElement('p');
    reminder.textContent = 'i need to get on with testing onedrive access';
    app.main.body.appendChild(reminder);

    setTimeout(() => {
        app.console.log('there was something else too...');
    }, 5000); // it was using sub or oid to store user settings!
    // i also need to fix the source map issue.
    // rememeber that preferred_username grabs the email address.

}