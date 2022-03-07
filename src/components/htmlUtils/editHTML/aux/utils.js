
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

/*Checks if there's a concrete class that should only appear on IOC
books*/
export function isIOCBook(htmlElement) {
  return htmlElement.querySelector(".book_info") !== null;
}