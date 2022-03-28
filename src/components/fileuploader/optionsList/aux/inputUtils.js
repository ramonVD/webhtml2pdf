/*Function to apply to a text after a new digit/letter/symbol has been added to that text.
It removes all* non-numbers from the text and returns it
 (*it also leaves a single period if there are any, or a
minus sign, but only if its in the first position as to denote negative numbers)*/
export const getANumber = (text, options) => {
    //by default, accept negative values and consider it an int
    const { isFloat = false} = options;
    const { canBeNegative = true } = options;
    if (canBeNegative && text === "-") { return text; }
    if (!canBeNegative && text.indexOf("-") !== -1) {
        text = text.replace(/-/g, "");
    }
    if (!isFloat && text.indexOf(".") !== -1) {
        text = text.replace(/\./g,"");
    }
    if (canBeNegative && (text.indexOf("-") !== -1 && text.indexOf("-",1) !== -1)) {
        /*Can use this regex to force all subsequent appearances of -
        after the first to be removed, it will only not remove it
        if its in the first position (ideal for the negative sign)*/
        return text.replace(/(?!^)-/g, "");
    }
    let noLetters = text.replace(/[^0-9.-]/g, "");
    //NOTA: Aixo per evitar coses rares com 1.23141.2515.35235
    noLetters = removeMoreThanOneSymbol(noLetters, ".");
    const tryNumber = isFloat ? parseFloat(noLetters) : parseInt(noLetters);
    if (!isNaN(tryNumber)) {
        return noLetters;
    }
    return "";
}

/*Return a maximum 6-digits hex value with a # before*/
export const getAHexNumber = (text) => {
    text = text.toUpperCase();
    if (text === "#") { return text; }
    if (text.indexOf("#") !== -1 && text.indexOf("#",1) !== -1) {
        return text.replace(/(?!^)#/g, "");
    }
    if (text.length > 0 && text.charAt(0) !== "#") text = "#" + text;
    if (text.length > 7) { text = text.substring(0,7);}
    return text.replace(/[^#0-9A-F]/, "");
}

/*Removes more than one symbol in a string, just leaves the first one 
from left to right. Can be probably done more easily
with a replace and a custom function inside 
function removeMoreThanOneSymbol(text, symbol) {
    if (text.indexOf(symbol) !== -1) {
        const restOfString = text.substring(text.indexOf(symbol)+1);
        if (restOfString === "") { return text; }
        const useSymbol = backslashSpecialRegexChars(symbol);
        const regex = new RegExp(useSymbol,"g");
        const removeOtherPeriods = restOfString.replace(regex, "");
        return text.substring(0, text.indexOf(symbol)+1) + removeOtherPeriods;
    }
    return text;
}*/

/*Same as the above commented function, removes all but the first
symbol found in a string (from left to right).
Is this one faster? More elegant? Need to test probably*/
function removeMoreThanOneSymbol(text, symbol) {
    if (text.indexOf(symbol) !== -1) {
        const useSymbol = backslashSpecialRegexChars(symbol);
        const regex = new RegExp(`(${useSymbol})`,"g");
        let first = true;
        //Remove all but the first instance of a symbol
        return text.replace(regex, (match) => {
            if (first) { 
                first = false; 
                return match;
            }
            return ""
        });
    }
    return text;
}

/*Prepend a backslash to a special regex character*/
function backslashSpecialRegexChars(char) {
    // eslint-disable-next-line no-useless-escape
    if (char.match(/[\.\+\*\?\^\$\(\)\[\]\{\}\|\\]/)) {
        return "\\" + char;
    }
    return char;
  }
  
/*Creates a shallow copy of a dict*/
export function copyDict(dict) {
    const newDict = {};
    for(const key of Object.keys(dict)) {
        newDict[key] = dict[key]
    }
    return newDict
}

/*Fastest way according to:
https://stackoverflow.com/questions/38304401/javascript-check-if-dictionary*/
export const isDict = dict => {
    return typeof dict === "object" && !Array.isArray(dict);
  };