import CPFL from "..";

export class TaskpaneApp extends CPFL {

   // need to think about migrating "global" styles to 3 specific modes and how to not load them all at once.
   // current chunking solution probably no good

   protected async render(ev: HashChangeEvent): Promise<void> {
      
   }
    
}



 /* ok this is what it needs to do
    render a dashboard!
    the dash you can reach by clicking on the page name
    or maybe just a home button to the left of the page name
    when you're on the dash, the app nav buttons are the page content
    and the header displays a nice welcome message
    when you're on a page, the app nav shows you the buttons
    
    */