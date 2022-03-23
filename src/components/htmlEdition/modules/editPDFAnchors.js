
/*UNUSED SO FAR... (WIP)*/
/*Per defecte, al campus els enllaços de l'index es converteixen en referencies a la url del curs
(trobada a una de les classes de body, concretament cmi-NUMERO DEL CURS AL CAMPUS)
en el format: https://ioc.xtec.cat/campus/mod/book/tool/print/index.php?id={ID CURS AL CAMPUS}#{ID ANCHOR}.
So no internal links, is there any way to generate internal links when converting html to pdf...????
https://stackoverflow.com/questions/20243876/how-to-create-links-to-sections-in-pdf
https://pdfcrowd.com/static/3rd/pdfjs/web/viewer.html?file=/genpdf/60740eee408adaaa1d301f0f7c144a03.pdf#ch374749
NOT WORKING.
APPARENTLY LINKS ARE SET CORRECTLY, ITS JUST THE HTML TO PDF CONVERTER THAT DOESNT
TRANSFORM THEM WELL. THIS WAS BASICALLY TESTING STUFF TO SEE IF CHANGING THE LINKS STRUCTURE LED 
TO CORRECT ANCHORS IN THE CREATED PDF DOCUMENT... BUT NO LUCK SO FAR.
export function setChapterLinks(htmlElement, filename) {
    let i = 1;
    Array.from(htmlElement.querySelectorAll(".book_toc_indented > ul > li > a, .book_toc_numbered > ul > li > a")).forEach( el => {
        console.log(el);
        if (el.href !== "") {
            const oldHref = el.href.match(/#ch\d+$/);
            if (oldHref[0].length > 0) {
                console.log("old",oldHref[0]);
                const finalLink = `#nameddest=${oldHref[0]}`;
                el.href = finalLink;
                console.log(finalLink);
                i++;
            }
        }
    });
}

*/