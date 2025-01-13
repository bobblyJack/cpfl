// is there a way to consolidate one extension to the html button element that does everything i want ?
// or am i better off just having helper functions in here?
// what do i actually want is probably a good first question.

type HTMLInputTypeButton = "submit" | "reset" | "button" | "image"

// there is possibly a requirement to have form buttons be specified cause they need specific shit like type set
// depends to what extent i want to use inbuilt stuff like submit and reset i guess