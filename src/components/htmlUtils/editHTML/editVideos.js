/*Functions to edit videos html, changing their formats, adding thumbnails...*/

/*Function to replace videos and iframes with videos to a text with a link
to the video*/
export function replaceVideosWithLink(htmlElement) {
    const iframes = findVideos(htmlElement);
    const arrayIframes = Array.from(iframes);
    const videoSrcs = arrayIframes.map( function(el) {
      if (isIframe(el)) {
        return el.src;
      } else if (isVideo(el)) {
          return getLazyVideoSrc(el);
      }
      return "";
    });
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
export function createVideosThumbnail(htmlElement) {
    const videos = findVideos(htmlElement);
    const videoArray = Array.from(videos);
    videoArray.forEach( video => {
      let src = "";
      if (isIframe(video)) {
        src = video.src;
      } else if (isVideo(video)) {
        src = getLazyVideoSrc(video);
      }
      if (src === undefined || src === "") { return; }
      if (isYoutubeVideo(src)) {
          //https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
          const ytRegExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
          const match = src.match(ytRegExp);
          //64 bits is enough for each human on earth to upload 2 billion videos, so length 11 shouldnt change?
          if (match && match[2].length === 11) {
              const thumbnailImgSrc = `https://img.youtube.com/vi/${match[2]}/mqdefault.jpg`;
              let videoDim = [video.width, video.height];
              //If dimensions of video are non existant or 0, set thumbnail size to 100%, auto
              if (videoDim[0] === undefined || videoDim[1] === 0 || videoDim[1] === undefined || videoDim[1] === 0) {
                videoDim = ["100%", "auto"];
              }
              //making the iframe invisible, inserting thumbnail img on top of it
              const img = createImg(thumbnailImgSrc, videoDim);
              video.style.display="none";
              video.parentNode.insertBefore(img, video);
          } else {
          //error, invalid youtube link, just change nothing and let the empty thumbnail probabaly?
          }
      }
      // Add here extra code for non youtube platforms like vimeo
      else {
          //Non supported video platform... do nothing too?
      }
  });
}

function isYoutubeVideo(videoSrc) {
  //Better regex: https://stackoverflow.com/questions/19377262/regex-for-youtube-url
  return videoSrc.match(/^(https?:\/\/)?(www\.youtube\.com|youtu\.be)\/.+$/);
}

function isIframe(element) {
  return element.tagName.toLowerCase() === "iframe";
}

function isVideo(element) {
  return element.tagName.toLowerCase() === "video";
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

//Creates an image element with defined src and dimensions
const createImg = (src, dimensions, alt) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt || "Text alternatiu";
    img.style.width = dimensions[0];
    img.style.height = dimensions[1];
    return img;
}