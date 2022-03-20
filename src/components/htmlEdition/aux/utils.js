
function isIframe(element) {
    return element.tagName.toLowerCase() === "iframe";
}
  
function isVideo(element) {
    return element.tagName.toLowerCase() === "video";
}

  
//To avoid function name collision?
export const isAnArray = (element) => element.constructor === Array

export function elementExists(element) {
  return (element !== null && element !== undefined);
}
/*Return all src strings for an array of videos, or a single src
string if its a single element.*/
export function getVideoSrc(videoElements) {
    if (!isAnArray(videoElements)) {
      videoElements = [videoElements];
    }
    const videoSrcs = videoElements.map( function(el) {
      if (isIframe(el)) {
        return el.src;
      } else if (isVideo(el)) {
          return getLazyVideoSrc(el);
      }
      return "";
    });
    return videoSrcs;
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