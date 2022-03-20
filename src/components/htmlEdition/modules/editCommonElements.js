/*Edit DOM properties of the common HTML elements, like body, headers...*/

/*Increase body font size and remove the left margin that the campus sets by default.
Maybe make the second one optional too but it just loses page space for no reason*/
export function editBody(htmlElement, newBodyFontSize) {
    const body = htmlElement.getElementsByTagName("body")[0];
    body.style.fontSize = newBodyFontSize;
    body.style.setProperty("margin-left", "15px" , "important");
}

/*So far, set a new base font size for the headers so they scale like
body does */
export function editHeaders(htmlElement, newHeaderFontSize) {
    //not using h3 headers in standard elements I think..
    htmlElement.querySelectorAll("h1, h2, h4, h5").forEach( miniHeader => 
        { miniHeader.style.setProperty("font-size", newHeaderFontSize , "important"); 
      });
}