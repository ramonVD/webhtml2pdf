import { elementExists } from "./aux/utils";
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

const modifiedProperties = ["fontValue", "marginTopValue"];
const relatedCSSProperties = ["font-size", "margin-top"]
/*So far, you cannot change the specific property to change, only font-size.
Adding more properties would be either a lot of work(add a select to every
table element with supported properties, then check input values too) or opening up
to some fun exploits(just add styles manually what could go wrong...) */
export function applyChangesToUserSelectors(htmlElement, arrayOfSelectorValuesDicts) {
    arrayOfSelectorValuesDicts.forEach( selVal => {
        if (selVal.hasOwnProperty("htmlSelector")) {
            //may need to try catch here, dunno how querySelector handles exceptions
            if (selVal.htmlSelector !== "") {
                const els = Array.from(htmlElement.querySelectorAll(selVal.htmlSelector));

                if (els.length > 0) {
                    els.forEach( el => {
                        /*Note: this makes you have to assign an explicit value of 
                        0 to a property of an element to make it 0.
                        The alternative is adding an element, then forgetting to set
                        the value and it being 0 by default...*/
                        for (const propPos in modifiedProperties) {
                            let newValue = "";
                            const property = modifiedProperties[propPos];
                            const propertyCSSName = relatedCSSProperties[propPos]
                            if (selVal.hasOwnProperty(property) && selVal[property] !== "") {
                                newValue = parseInt(selVal[property]) + "px";
                            }
                            if (elementExists(el) && newValue !== ""){
                                el.style.setProperty(propertyCSSName, newValue, "important")
                            }
                        }
                    });
                }
            }
        }
    });
}