
/*Checks if its a valid youtube link*/
export function isYoutubeVideo(videoSrc) {
    //Better regex: https://stackoverflow.com/questions/19377262/regex-for-youtube-url
    return videoSrc.match(/^(https?:\/\/)?(www\.youtube\.com|youtu\.be)\/.+$/);
  }
  
export function getYoutubeThumbnailSrc(src) {
     //https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
     const ytRegExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
     const match = src.match(ytRegExp);
     //64 bits is enough for each human on earth to upload 2 billion videos, so length 11 shouldnt change?
     if (match && match[2].length === 11) {
         return `https://img.youtube.com/vi/${match[2]}/mqdefault.jpg`;
     }
    //error, invalid youtube link
    return "";
}