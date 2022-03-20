import { isAnArray } from "./utils";
import fetch from 'cross-fetch';

/*Probably change this regex, need to check more possible structures. 
Apparently vimeo changes this a lot, so I don't know.
Provides the match and captures the video ID.*/
export function isVimeoVideo(videoSrc) {
  return videoSrc.match(/^https:\/\/player\.vimeo\.com\/video\/(\d{8})$/);
}

/*Queries vimeo API to obtain the thumbnail image source of a video.
Different sizes, defaults to the big one.*/
export async function getVimeoThumbnailSrc(videoSrc) {
    //Reusing match function since it returns the correct vimeo ID
    const videoIDMatch = isVimeoVideo(videoSrc);
    if (isAnArray(videoIDMatch) && videoIDMatch.length > 0) {
        const vimeoID = videoIDMatch[1];
    
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
            if (videoData.hasOwnProperty("thumbnail_medium")) {
                return videoData.thumbnail_medium;
            } else if (videoData.hasOwnProperty("thumbnail_large")) {
                return videoData.thumbnail_large;
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
    return "";
}
