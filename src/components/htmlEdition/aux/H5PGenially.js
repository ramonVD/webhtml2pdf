/*Note: H5P is just some embedded solution to add small premade
apps with some options to pages, like quizes, interactive presentations...
https://h5p.org/

Geniallies are just a link to an embedded iframe that shows a presentation

They'll be treated like videos since we only need to provide their link.
Maybe try to get a snapshot of its first DOM (they're inside an IFrame),
but that opens up exploits imo.
They show up as naked iframes in the use case, differentiate by src...*/


export function isH5P(src) {
    return src.match(/^https:\/\/ioc\.xtec.cat\/campus\/mod\/hvp\/embed\.php\?id=(\d+)$/);
  }

//double check this
export function isGenially(src) {
  return src.match(/^https:\/\/view.genial.ly\//);
}