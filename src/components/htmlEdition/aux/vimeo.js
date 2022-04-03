import { getWidthValue, isAnArray } from "./utils";
import fetch from 'cross-fetch';

/*Probably change this regex, need to check more possible structures. 
Apparently vimeo changes this a lot, so I don't know.
Provides the match and captures the video ID.*/
/*
Examples (add a test):
https://player.vimeo.com/video/611546210?h=b516b8a392&badge=0&autopause=0&player_id=0&app_id=58479

https://player.vimeo.com/video/89903374*/
export function isVimeoVideo(videoSrc) {
  return videoSrc.match(/^https:\/\/player\.vimeo\.com\/video\/(\d+\?h=[a-z0-9]+|\d{8})/);
}

/*Queries vimeo API to obtain the thumbnail image source of a video.
Different sizes, defaults to the big one.*/
export async function getVimeoThumbnailSrc(videoSrc) {
    //Reusing match function since it returns the correct vimeo ID
    const videoIDMatch = isVimeoVideo(videoSrc);
    if (isAnArray(videoIDMatch) && videoIDMatch.length > 0) {
        const vimeoID = videoIDMatch[1];
    
        //https://stackoverflow.com/questions/1361149/get-img-thumbnails-from-vimeo
        const vimeoJSON = await fetch(`https://vimeo.com/api/oembed.json?url=https://player.vimeo.com/video/${vimeoID}`)
        .then(res => {
            if (res.status >= 400) {
            console.log("Error - cannot access vimeo API.");
            return "";
            }
            return res.json();
        })
        .then(data => {
            if (data === "" || data.length < 1) { return "";}
            if (data.hasOwnProperty("thumbnail_url")) {
                return {url: data.thumbnail_url, height: data.thumbnail_height ,width: data.thumbnail_width};
            } else {
                return {url: ""};
            }
        })
        .catch(err => {
            console.log("Error fetching vimeo thumbnail:");
            console.log(err);
            return {url: ""};
        });
        return vimeoJSON;
    }
    return {url: ""};
}
