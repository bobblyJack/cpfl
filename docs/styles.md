/* CSS SELECTIONS
rename banner and tray to header and footer, duh
use element ids instead of classes to style
#elementID
.classID
though, double check inheritance still works
it does, carry on.
you can also use > to get the direct children
and i think there is something with + that gets siblings
the + gets adjacent siblings, like, that appear right after
~ gets all siblings, neat
otherwise obviously space is for general descendants
can also do * for global stuff
and [] can grab based on attributes
like [class] could get anything with a class
: is used for pseudo-classes
    :hover applies when hovered over
    :focus when focused on
    :nth-child(n) (n can be stuff like odd not just numbers)
    :first-child, :last-child
    there are actually heaps!
:: is for pseudo elements like
    ::before and ::after
    it can be used to insert content dynamically
    this seems better done through script though
 */
