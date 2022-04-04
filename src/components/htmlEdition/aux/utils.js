
function isIframe(element) {
    return element.tagName.toLowerCase() === "iframe";
}

function isVideo(element) {
    return element.tagName.toLowerCase() === "video";
}

function isAudio(element) {
  return element.tagName.toLowerCase() === "audio";
}

export function isUl(element) {
  return element.tagName.toLowerCase() === "ul";
}
    
//To avoid function name collision?
export const isAnArray = (element) => element.constructor === Array

export function elementExists(element) {
  return (element !== null && element !== undefined);
}

/*Return all src strings for an array of videos, or a single src
string if its a single element.*/
export function getInteractiveElementSrc(elementsSrc) {
    if (!isAnArray(elementsSrc)) {
      elementsSrc = [elementsSrc];
    }
    const srcs = elementsSrc.map( function(el) {
      if (isIframe(el)) {
        return el.src;
      }else if (isAudio(el)) {
        return getAudioSrc(el);
      } else if (isVideo(el)) {
          return getLazyVideoSrc(el);
      }
      return "";
    });
    return srcs;
  }
  
  //Gets the src of the video if the element is a video-js construct
function getLazyVideoSrc(videoElement) {
    const videoAttrStr = videoElement.getAttribute("data-setup-lazy");
    if (videoAttrStr !== undefined) {
      const videoAttr = JSON.parse(videoAttrStr);
      if (videoAttr.hasOwnProperty("sources") && videoAttr["sources"].length > 0 
        && videoAttr["sources"][0].hasOwnProperty("src")) { 
        return videoAttr["sources"][0]["src"];
      }
    }
    return "";
  }

  /*Eliminates element (and all children) from the DOM if it exists*/
export function removeIfExists(htmlElement) {
  if (elementExists(htmlElement)) {
    htmlElement.remove();
  }
}

/*Find elements if they have a concrete attribute in their styles*/
export function FindByStyleAttr(htmlElement, attribute) {
  var All = htmlElement.getElementsByTagName("*");
  const foundElements = [];
  for (var i = 0; i < All.length; i++) {
    if (All[i].style[attribute] && All[i].style[attribute] !== "") {
      foundElements.push(All[i]);
    }
  }
  return foundElements;
}



//Check if its a valid number.
// https://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric
export function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}


  
/*Eliminates children elements of the parent node until an element
with the desired class has been found. Careful with this.*/
export function eliminateChildrenUntilFindClass(parentNode, className) {
  if (!elementExists(parentNode)) { return; }
  const children = parentNode.children;
  for (let childElement of Array.from(children)) {
    if (childElement.classList.contains(className)) {
      break;
    }
    childElement.remove();
  }
}


/*Returns the actual value of a DOM element's width in pixels as a string.
The value is taken from the a defined attribute in its outer HTML,
from the styles or just getting its width from its bounds.*/
export function getWidthValue(element) {
  let result;
  const stylesMatch = element.style.width.match(/((\d+)px$|(\d+$))/);
  if (stylesMatch) {
    result = stylesMatch[2];
  } else {
    const attrMatch = (element.getAttribute("width") === null) ? false : element.getAttribute("width").match(/((\d+)px$|(\d+$))/);
    if (attrMatch) {
      result = attrMatch[1];
    } else {
      //fallback, may need to use getBoundingClientRect...
      result = element.offsetWidth;
    }
  }
  return result.toString();
}

function getAudioSrc(element) {
  const source = element.querySelector("source");
  //Probably add more checks, need more examples of how sound is displayed
  if (source) {
    return source.src;
  }
  return "";
}

/* Copies styles from an element to another. Inspired by
https://stackoverflow.com/questions/9430659/how-to-get-all-the-applied-styles-of-an-element-by-just-giving-its-id
Still unsure if it changes compost named styles (background-color. f ex), since
normally when modifying them programatically you use their compound name
(in the latter case, backgroundColor. Worried I'm just adding properties
to the prototype in that case, for width/height it should work. Maybe
use the CSSwhatever object method found in that link. Unused in the end.*/

export const copyStyles = (el, targetEl) => {
  if (!el || !targetEl) { return; }
  const elStyles = el.getAttribute("style").split(";").map(
    (compoundStyle) => {
      const styleNameValue = compoundStyle.split(":");
        return {[styleNameValue[0]]:styleNameValue[1]}
    }
  ).filter( dictValue => Object.keys(dictValue)[0] !== "");

  elStyles.forEach( (elStyle) => {
    const styleKV = Object.entries(elStyle)[0];
    targetEl.style[styleKV[0]] = styleKV[1];
  });
}