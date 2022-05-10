import { isAnArray } from "./utils";
import fetch from 'cross-fetch';

/*Probably change this regex, need to check more possible structures. 
Apparently vimeo changes this a lot, so I don't know.
Provides the match and captures the video ID.*/
/*
Examples (add a test):
https://player.vimeo.com/video/611546210?h=b516b8a392&badge=0&autopause=0&player_id=0&app_id=58479

https://player.vimeo.com/video/89903374*/
export function isVimeoVideo(videoSrc) {
  return videoSrc.match(/^https:\/\/player\.vimeo\.com\/video\/(\d+\?h=[a-z0-9]+|\d+)/);
}

/*Queries vimeo API to obtain the thumbnail image source of a video.
Different sizes, defaults to the big one.*/
export async function getVimeoThumbnailSrc(videoSrc) {
    //Reusing match function since it returns the correct vimeo ID
    const videoIDMatch = isVimeoVideo(videoSrc);
    if (isAnArray(videoIDMatch) && videoIDMatch.length > 0) {
        const vimeoID = videoIDMatch[1];

        /*NOTE: There are two main ways to get vimeo thumbnails that I have found.
        The first is if its a public video, use this method:
        //https://stackoverflow.com/questions/1361149/get-img-thumbnails-from-vimeo
        If its not public (insofar it has an h=... in its url as a parameter, or
        maybe there are other ways to check, use the second url to get its data
        in json format.) If its a totally private video I guess none of this
        will work, but this works for partially private videos (watch from this
        url, whitelisted IPs...)        */

        const privateVideo = (vimeoID.indexOf("?h=") !== -1) ? true : false;
        const fetchURL = privateVideo ? 
            `https://vimeo.com/api/oembed.json?url=https://player.vimeo.com/video/${vimeoID}` :
            `https://vimeo.com/api/v2/video/${vimeoID}.json`
        const vimeoJSON = await fetch(fetchURL)
        .then(res => {
            if (res.status >= 400) {
            console.log("Error - cannot access vimeo API.");
            return "";
            }
            return res.json();
        })
        .then(data => {
            const vimeoJSON = privateVideo ? data : data[0];
            if (vimeoJSON === "" || vimeoJSON.length < 1) { return "";}
            if (vimeoJSON.hasOwnProperty("width")) {
                const dataDict = (privateVideo) ? 
                { 
                    url: vimeoJSON.thumbnail_url, 
                    height: vimeoJSON.thumbnail_height, 
                    width: vimeoJSON.thumbnail_width
                } : 
                {
                    url: vimeoJSON.thumbnail_large, 
                    height: vimeoJSON.height, 
                    width: vimeoJSON.width
                } 
                return dataDict;
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
