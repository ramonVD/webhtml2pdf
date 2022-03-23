/*Note: H5P is just some embedded solution to add small premade
apps with some options to pages, like quizes, interactive presentations...
https://h5p.org/

They'll be treated like videos since we only need to provide their link.
Maybe try to get a snapshot of its first DOM (they're inside an IFrame),
but that opens up exploits imo.
They show up as naked iframes in the use case, differentiate by src...*/


function isH5P(src) {
    return src.match(/^https:\/\/ioc\.xtec.cat\/campus\/mod\/hvp\/embed\.php\?id=(\d+)$/);
  }


export default isH5P;
