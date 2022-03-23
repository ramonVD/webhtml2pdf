import { isNumber, getWidthValue } from "../aux/utils";

/*Name of the real css properties that are changed, relative to their name in
the keyValueAssign dict*/
const modifiedCSSProperties = { 
    fontValue: "font-size", 
    marginTopValue: "margin-top", 
    widthValue: "width",
    bgColorValue: "background-color"
};

/* Changes the specified property of the specified element in the DOM of htmlElement.
    Input is as an array of dicts from keyValueAssign.js (KV_DEFAULT_DICT),
    that, for a specific querySelector, specify some properties values. 

    It applies these attribute value change to every selector and it'll return
    an array with true/false (if there was an error) for every selector checked.
*/
export function applyUserChangesToSelectors(htmlElement, arrayOfSelectorValuesDicts) {
    const selectorErrors = arrayOfSelectorValuesDicts.map( selVal => {
        if (selVal.hasOwnProperty("htmlSelector")) {
            if (selVal.htmlSelector !== "") {
                /*No need to sanitize queryselector queries (except check if it found something)
                that I have found. Just check if it returns an exception and set a message*/
                let els;
                try {
                    els = Array.from(htmlElement.querySelectorAll(selVal.htmlSelector));
                } catch {
                    return selVal.htmlSelector;
                }

                if (els.length > 0) {
                    els.forEach( el => {
                        /*Note: this makes you have to assign an explicit value of 
                        0 to a property of an element to make it 0.
                        The alternative is adding an element, then forgetting to set
                        the value and it being 0 by default...*/
                        for (const property of Object.keys(modifiedCSSProperties)) {
                            let propertyValue = "";
                            const propertyCSSName = modifiedCSSProperties[property];
                            if (selVal.hasOwnProperty(property) && selVal[property] !== "") {
                                if (selVal[property].charAt(0) === "#") {
                                    //sanitize hypothetical hex value, no need to add zeroes or Fs
                                    //to the right, css does that automatically apparently?
                                    const NonHexPattern = /[^0-9a-fA-F#]/g;
                                    propertyValue = NonHexPattern.test(selVal[property]) ? "" : selVal[property];
                                } else {                           
                                /*Sanitize in case its not a number...*/
                                /*Maybe implement maximum/minimum values for specific properties (
                                    f.ex: dont let them set font-size +200 or itll bork the page) */
                                    propertyValue = isNumber(selVal[property]) ? selVal[property] + "px": "";
                                }
                            }
                            if (propertyValue !== ""){
                                //Width value is added to the element's actual width
                                if (propertyCSSName === "width") {
                                    const origElValue = parseInt(getWidthValue(el));
                                    /*Not setting 0 as minimum value makes elements reverts to their "default"
                                    width if set like this (probably just reads it as invalid???)*/
                                    propertyValue = Math.max(0, origElValue + parseInt(selVal[property])) + "px";
                                }
                                el.style.setProperty(propertyCSSName, propertyValue, "important")
                            }
                        }
                    });
                }
            }
        }
        return "";
    });
    return selectorErrors;
}

export default applyUserChangesToSelectors;