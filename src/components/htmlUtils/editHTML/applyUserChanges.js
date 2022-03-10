import { elementExists, isNumber } from "./aux/utils";

/*Name of the real css properties that are changed, relative to their name in
the keyValueAssign dict*/
const modifiedCSSProperties = { 
    fontValue: "font-size", marginTopValue: "margin-top", widthValue: "width" 
};

/* Changes the specified property of the specified element in the DOM of htmlElement.
    It comes as an array of dicts from keyValueAssign.js (KV_DEFAULT_DICT),
    that, for a specific querySelector, specify some properties value. */
export function applyChangesToUserSelectors(htmlElement, arrayOfSelectorValuesDicts) {
    arrayOfSelectorValuesDicts.forEach( selVal => {
        if (selVal.hasOwnProperty("htmlSelector")) {
            if (selVal.htmlSelector !== "") {
                /*No need to sanitize queryselector queries (except check if it found something)
                that I have found.*/
                const els = Array.from(htmlElement.querySelectorAll(selVal.htmlSelector));

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
                                    /*Sanitize in case its not a number...*/
                                    propertyValue = isNumber(selVal[property]) ? selVal[property] + "px": "";
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
    });
}

export default applyChangesToUserSelectors;