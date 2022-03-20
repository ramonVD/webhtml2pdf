import { elementExists, isNumber } from "../aux/utils";

/*Name of the real css properties that are changed, relative to their name in
the keyValueAssign dict*/
const modifiedCSSProperties = { 
    fontValue: "font-size", 
    marginTopValue: "margin-top", 
    widthValue: "width",
    bgColorValue: "background-color"
};

/* Changes the specified property of the specified element in the DOM of htmlElement.
    It comes as an array of dicts from keyValueAssign.js (KV_DEFAULT_DICT),
    that, for a specific querySelector, specify some properties value. 

    It applies the changes to every selector and if a single selector is erroneus
    it'll return true;
*/
export function applyUserChangesToSelectors(htmlElement, arrayOfSelectorValuesDicts) {
    const selectorErrors = arrayOfSelectorValuesDicts.map( selVal => {
        if (selVal.hasOwnProperty("htmlSelector")) {
            if (selVal.htmlSelector !== "") {
                /*No need to sanitize queryselector queries (except check if it found something)
                that I have found. Just check if it return an exception and set a message*/
                let els;
                try {
                    els = Array.from(htmlElement.querySelectorAll(selVal.htmlSelector));
                } catch {
                    return selVal.htmlSelector;
                }

                if (els.length > 0) {
                    els.forEach( el => {
                        if (elementExists(el)) {
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
                                        propertyValue = isNumber(selVal[property].substring(1)) ? selVal[property] : "";
                                    } else {                           
                                    /*Sanitize in case its not a number...*/
                                    /*Maybe implement maximum/minimum values for specific properties (
                                        f.ex: dont let them set font-size +200 or itll bork the page) */
                                        propertyValue = isNumber(selVal[property]) ? selVal[property] + "px": "";
                                    }
                                }
                                if (propertyValue !== ""){
                                    el.style.setProperty(propertyCSSName, propertyValue, "important")
                                }
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