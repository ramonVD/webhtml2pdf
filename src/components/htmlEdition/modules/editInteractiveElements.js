import { isYoutubeVideo, getYoutubeThumbnailSrc } from "../aux/youtube";
import { isVimeoVideo, getVimeoThumbnailSrc } from '../aux/vimeo';
import { isH5P, isGenially } from "../aux/H5PGenially";
import { getInteractiveElementSrc } from '../aux/utils';
/* Functions to edit interactive elements html.
Depending on the element type it'll do extra stuff (for videos, can add thumbnails...),
for most just show its link.

So far, only need to fetch API info when encountering Vimeo videos.*/

/*Function to replace interactive elements (videos, iframes...) with a link
to the element*/
export function replaceElementsWithLink(htmlElement) {
    const interactiveElements = findinteractiveElements(htmlElement);
    const arrayIntElements= Array.from(interactiveElements);
    const elSrcs = getInteractiveElementSrc(arrayIntElements);
    let newElement;
    for (let i = 0; i < arrayIntElements.length; i++) {
      newElement = createVideoReplacement(elSrcs[i]);
      interactiveElements[i].parentNode.replaceChild(newElement, interactiveElements[i])
    }
  }

  /*This will get videos, audios (for some reason they also use
    the second class, and iframes in a IOC document */
  function findinteractiveElements(htmlElement) {
    return htmlElement.querySelectorAll("iframe, .video-js");
  }

  /*Creates a div with a text and a link to the src of an element*/ 
  const createVideoReplacement = (src, leadingText) => {
    const newDiv = document.createElement('div');
    newDiv.classList.add("py-5");
    const p = document.createElement("p");
    const insertText = leadingText ? leadingText : getLinkType(src);
    p.innerHTML = `<strong>${insertText}:&nbsp;&nbsp;&nbsp;</strong>`;
    const newLink = document.createElement('a');
    newLink.innerText = (src === "") ? "No trobat" : src;
    newLink.href = (src === "") ?  "#" : src;
    //Dunno if needed because in the end, its a pdf doc...
    newLink.rel = "noopener";
    p.appendChild(newLink);
    newDiv.appendChild(p);
    return newDiv;
  }


/*Function to replace all interactive elements in the page 
for their thumbnails and optionally the element's link under it.*/
export async function createInteractiveElementsThumbnail(htmlElement, options) {
  const intElements = findinteractiveElements(htmlElement);
  const intElArray = Array.from(intElements);
  const possibleVimeos = [];
  const vimeoPromises = [];

  const {videoImgsState, cleanVideoDivs} = options;
  const imgAndLink = videoImgsState > 0;
  const insertOptions = {imgAndLink: imgAndLink, 
    cleanVideoDivs: cleanVideoDivs}

  for (let element of intElArray) {
    const src = getInteractiveElementSrc(element)[0];
    if (src === undefined || src === "") { return; }
    if (isYoutubeVideo(src)) {
      const thumbnailImgSrc = getYoutubeThumbnailSrc(src);
      if (thumbnailImgSrc !== "") {
        insertThumbnailForVideo(element, thumbnailImgSrc, src, insertOptions);
      }
    }
    else if (isVimeoVideo(src)) {
      possibleVimeos.push({video: element, src: src});
      vimeoPromises.push(Promise.resolve(getVimeoThumbnailSrc(src)));
    } else if (isH5P(src)){
      const h5pLink = createVideoReplacement(src);
      element.parentNode.replaceChild(h5pLink, element)
    } else {
      /*Not a supported video type. It can be, so far:
      audio element, genially, h5p...*/
      element.parentNode.after(createVideoReplacement(src));
    }
  }
  //Try fetching all vimeo API thumbnail srcs in parallel
  try {
    const foundSrcs = await Promise.allSettled(vimeoPromises);
    foundSrcs.forEach( (thumbnailImgSrc, index) => {
      const imgJSONData = thumbnailImgSrc.value;
      if (imgJSONData.url !== "") {
        const dims = imgJSONData.width ? [imgJSONData.width, imgJSONData.height] : undefined;
        if (dims) { insertOptions.dims = dims;}
        insertThumbnailForVideo(possibleVimeos[index].video,
          thumbnailImgSrc.value.url, possibleVimeos[index].src, 
          insertOptions);
      }
    });
    /*No need to return anything, insertThumbnailForVideo modifies document DOM*/
  } catch (err) { 
    console.log(err);
  }
}

/*Inserts the thumbnail image in the dom before the video element,
then removes the original video element.*/
const insertThumbnailForVideo = (videoElement, imgsrc, videoSrc, options) => {
  const { dims, imgAndLink, cleanVideoDivs} = options;
  let videoDims = getVideoDims(videoElement);
  if (videoDims[0] === "100%" && videoDims[1] === "auto") {
    if (dims) {
      videoDims = dims.slice();
    }
  }
  const img = createImgWSrcText(imgsrc, videoDims, videoSrc, imgAndLink);

  const videoParent = videoElement.parentNode;

  /*Fix for a way to insert youtube/vimeo videos with fullscreen that messes
  up the positioning of the thumbnail image if present.
  (Basically it sets padding-top of the wrapping div to 56.25%~ )
  Optional because someone may have done something weird and may
  not need this 'fixed'. Maybe make more extensive changes*/
  if (cleanVideoDivs) {
    videoParent.style.paddingTop = "0";
  }

  videoParent.insertBefore(img, videoElement);
  videoElement.remove();
}

/*Creates a div containing an image from a src with the desired dimentions,
and under it a link to a video. */
const createImgWSrcText = (imgSrc, dimensions, videoSrc, imgAndLink, alt) => {
  const image = createImg(imgSrc, dimensions, alt);
  if (imgAndLink) {
    const wrapperDiv = document.createElement("div");
    //Set the default video div css, using campus default styles (.mediaplugin)
    wrapperDiv.style.width = "100vw";
    wrapperDiv.style.maxWidth = "100%";
    wrapperDiv.style.display = "block";
    wrapperDiv.style.marginTop = "5px";
    wrapperDiv.style.marginBottom = "5px";
    wrapperDiv.style.textAlign = "center";
    wrapperDiv.append(image);
    const link = document.createElement("a");
    link.href = videoSrc;
    wrapperDiv.append(link);
    link.style.display = "block";
    link.innerHTML = `<small>${videoSrc}</small>`;
    return wrapperDiv;
  }
  return image;
}

//Creates an image element with defined src and dimensions
const createImg = (src, dimensions, alt) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt || "Text alternatiu";
    img.style.width = dimensions[0] + "px";
    img.style.height = dimensions[1] + "px";
    return img;
}

const getVideoDims = (videoElement) => {
  let videoDim = [videoElement.width, videoElement.height];

  //If dimensions of video are non existant or 0, set thumbnail size to 100%, auto
  if (videoDim[0] === undefined || [0,""].includes(videoDim[1]) || videoDim[1] === undefined || [0,""].includes(videoDim[1])) {
    videoDim = ["100%", "auto"];
  }
  return videoDim;
}

const getLinkType = (src) => {
  if (isYoutubeVideo(src) || isVimeoVideo(src)) {
    return "Vídeo";
  }
  else if (isH5P(src)) {
    return "H5P"
  } else if (isGenially(src)) {
    return "Genially";
  }  else if (src.match(/\.(wav|mp3|ogg|aiff|webm)$/)) {
    return "Audio";
  }
  return "Enllaç";
}
