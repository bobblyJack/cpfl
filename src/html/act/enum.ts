/**
 * used as the key for the index of parties on a matter
 * @TBD third parties
 * @TBD multiple parties of same type
 */
export enum ParticipantLink {
    
    rl, // us
    rp, // our client
    rc, // our counsel
    
    op, // other side
    ol, // their lawyer
    oc // their counsel

}

/* legend filters
(.include("x") can narrow type)

R - "responsible" (our side)
O - "otherside" (the other party)
P - "party" (non-professionals)
L - "lawyer" (solicitor)
C - "counsel" (barrister)

*/

