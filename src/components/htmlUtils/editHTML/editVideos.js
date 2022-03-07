/*Functions to edit videos html, changing their formats, adding thumbnails...*/
import fetch from 'cross-fetch';

/*Function to replace videos and iframes with videos to a text with a link
to the video*/
export function replaceVideosWithLink(htmlElement) {
    const iframes = findVideos(htmlElement);
    const arrayIframes = Array.from(iframes);
    const videoSrcs = getVideoSrc(arrayIframes);
    let newElement;
    for (let i = 0; i < arrayIframes.length; i++) {
      newElement = createVideoReplacement(videoSrcs[i]);
      iframes[i].parentNode.replaceChild(newElement, iframes[i])
    }
  }

  /*Function to find all videos in the document. Currently supports the format of my
  books, probably need to check lots of other use cases*/
  function findVideos(htmlElement) {
    return htmlElement.querySelectorAll("iframe, .video-js");
  }

  /*Creates a div with a text and a link to the src of a video*/ 
  const createVideoReplacement = (src) => {
    const newDiv = document.createElement('div');
    newDiv.classList.add("py-5");
    // style div
    const p = document.createElement("p");
    p.innerHTML = "Vídeo:&nbsp;&nbsp;&nbsp;";
    const newLink = document.createElement('a');
    newLink.innerText = (src === "") ? "No trobat" : src;
    newLink.href = (src === "") ?  "#" : src;
    p.appendChild(newLink);
    newDiv.appendChild(p);
    return newDiv;
  }


/*Function to swap all videos in the page for their thumbnails...*/
export async function createVideosThumbnail(htmlElement) {
    const videos = findVideos(htmlElement);
    const videoArray = Array.from(videos);
    for (let video of videoArray) {
      const src = getVideoSrc(video)[0];
      if (src === undefined || src === "") { return; }
      if (isYoutubeVideo(src)) {
          //https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
          const ytRegExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
          const match = src.match(ytRegExp);
          //64 bits is enough for each human on earth to upload 2 billion videos, so length 11 shouldnt change?
          if (match && match[2].length === 11) {
              const thumbnailImgSrc = `https://img.youtube.com/vi/${match[2]}/mqdefault.jpg`;
              const videoDim = getVideoDims(video);
              //making the iframe invisible, inserting thumbnail img on top of it
              const img = createImgWSrcText(thumbnailImgSrc, videoDim, src);
              video.style.display = "none";
              video.parentNode.insertBefore(img, video);
          } else {
          //error, invalid youtube link, just change nothing and let the empty thumbnail probabaly?
          }
      }
      else if (isVimeoVideo(src)) {
        const videoIDMatch = getVimeoVideoID(src);
        if (isAnArray(videoIDMatch) && videoIDMatch.length > 0) {
          const videoID = videoIDMatch[1];
          /*Call Vimeo's API to get the thumbnail img... blocking... change this
          To call all elements in parallel? Gotta check how (Promise.all) */
          const thumbnailImgSrc = await getVimeoThumbnailSrc(videoID);
          if (thumbnailImgSrc !== "") {
            const videoDim = getVideoDims(video);
            const img = createImgWSrcText(thumbnailImgSrc, videoDim, src);
            video.style.display = "none";
            video.parentNode.insertBefore(img, video);
          }
        } else {
          //Not a supported vimeo video (yet?)
        }
        
      }
      
      // Add here extra code for non youtube platforms like vimeo

      else {
          //Non supported video platform... do nothing too?
      }
  }
}


function isIframe(element) {
  return element.tagName.toLowerCase() === "iframe";
}

function isVideo(element) {
  return element.tagName.toLowerCase() === "video";
}

//To avoid function name collision?
const isAnArray = (element) => element.constructor === Array

/*Return all src strings for an array of videos, or a single src
string if its a single element.*/
function getVideoSrc(videoElements) {
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

const createImgWSrcText = (imgSrc, dimensions, videoSrc, alt) => {
  const image = createImg(imgSrc, dimensions, alt);
  const wrapperDiv = document.createElement("div");
  const link = document.createElement("a");
  link.href = videoSrc;
  link.style.display = "block";
  link.innerHTML = `<small>${videoSrc}</small>`;
  wrapperDiv.style.display="flex";
  wrapperDiv.style.flexDirection = "column";
  wrapperDiv.style.alignItems ="center";
  wrapperDiv.style.flexWrap = "nowrap";
  wrapperDiv.append(image);
  wrapperDiv.append(link);
  return wrapperDiv;
}
//Creates an image element with defined src and dimensions
const createImg = (src, dimensions, alt) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt || "Text alternatiu";
    img.style.width = dimensions[0];
    img.style.height = dimensions[1];
    return img;
}

const getVideoDims = (videoElement) => {
  let videoDim = [videoElement.width, videoElement.height];
  //If dimensions of video are non existant or 0, set thumbnail size to 100%, auto
  if (videoDim[0] === undefined || videoDim[1] === 0 || videoDim[1] === undefined || videoDim[1] === 0) {
    videoDim = ["100%", "auto"];
  }
  return videoDim;
}

//Youtube
function isYoutubeVideo(videoSrc) {
  //Better regex: https://stackoverflow.com/questions/19377262/regex-for-youtube-url
  return videoSrc.match(/^(https?:\/\/)?(www\.youtube\.com|youtu\.be)\/.+$/);
}

//Vimeo
const getVimeoVideoID = (videoSrc) => 
videoSrc.match(/^https\:\/\/player\.vimeo\.com\/video\/(\d{8})$/);

/*Probably change this regex, need to check more possible structures. 
Apparently vimeo changes this a lot, so uhhh Iunno*/
function isVimeoVideo(videoSrc) {
  return videoSrc.match(/^https\:\/\/player\.vimeo\.com\/video\/(\d{8})$/);
}

//Gotta use vimeo's API
async function getVimeoThumbnailSrc(vimeoID) {
  //https://stackoverflow.com/questions/1361149/get-img-thumbnails-from-vimeo
  const vimeoJSON = await fetch(`http://vimeo.com/api/v2/video/${vimeoID}.json`)
  .then(res => {
    if (res.status >= 400) {
      console.log("Error - cannot access vimeo API.");
      return "";
    }
    return res.json();
  })
  .then(data => {
    if (data === "" || data.length < 1) { return "";}
    const videoData = data[0];
    if (videoData.hasOwnProperty("thumbnail_large")) {
      return videoData.thumbnail_large;
    } else if (videoData.hasOwnProperty("thumbnail_medium")) {
      return videoData.thumbnail_medium;
    } else {
      return "";
    }
  })
  .catch(err => {
    console.log("Error fetching vimeo thumbnail:");
    console.log(err);
    return "";
  });
  return vimeoJSON;
}