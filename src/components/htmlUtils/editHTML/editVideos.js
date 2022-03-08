/*Functions to edit videos html, changing their formats, adding thumbnails...*/
import { isYoutubeVideo, getYoutubeThumbnailSrc } from "./aux/youtube";
import { isVimeoVideo, getVimeoThumbnailSrc } from './aux/vimeo';
import { getVideoSrc } from './aux/utils';
/* So far, only need to fetch API info when encountering Vimeo videos.
TO-DO: 
- Need to implement Promise.all to call for all videos info simultaneously
- LINK TO THE VIDEO AFTER THE THUMBNAIL IS AN OPTION, NOT DONE ALWAYS*/

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


/*Function to swap all videos in the page for their thumbnails + the video link under it...*/
export async function createVideosThumbnail(htmlElement, imgAndLink) {
  const videos = findVideos(htmlElement);
  const videoArray = Array.from(videos);
  const possibleVimeos = [];
  const vimeoPromises = [];
  for (let video of videoArray) {
    const src = getVideoSrc(video)[0];
    if (src === undefined || src === "") { return; }
    if (isYoutubeVideo(src)) {
      const thumbnailImgSrc = getYoutubeThumbnailSrc(src);
      if (thumbnailImgSrc !== "") {
        insertThumbnailForVideo(video, thumbnailImgSrc, src, imgAndLink);
      }
    }
    else if (isVimeoVideo(src)) {
      /*Call Vimeo's API to get the thumbnail imgs*/
      possibleVimeos.push({video: video, src: src});
      vimeoPromises.push(Promise.resolve(getVimeoThumbnailSrc(src)));
    } else {
      //Not a supported video type (yet?) (dailymotion...?)
    }
  }
  //Try fetching all vimeo API thumbnail srcs in parallel
  try {
    const foundSrcs = await Promise.allSettled(vimeoPromises);
    foundSrcs.map( (thumbnailImgSrc, index) => {
      if (thumbnailImgSrc !== "") {
        insertThumbnailForVideo(possibleVimeos[index].video, thumbnailImgSrc, 
          possibleVimeos[index].src, imgAndLink);
      }
      return "";
    });
    /*No need to return anything, insertThumbnailForVideo modifies document DOM*/
  } catch (err) { 
    console.log(err);
  }
}

/*Inserts the thumbnail image in the dom before the video element,
makes the video element invisible.*/
const insertThumbnailForVideo = (video, thumbnailImgSrc, videoSrc, imgAndLink) => {
  const videoDim = getVideoDims(video);
  //making the iframe invisible, inserting thumbnail img on top of it
  const img = createImgWSrcText(thumbnailImgSrc, videoDim, videoSrc, imgAndLink);
  video.style.display = "none";
  video.parentNode.insertBefore(img, video);
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
  if (videoDim[0] === undefined || videoDim[1] === 0 || videoDim[1] === undefined || videoDim[1] === 0) {
    videoDim = ["100%", "auto"];
  }
  return videoDim;
}

