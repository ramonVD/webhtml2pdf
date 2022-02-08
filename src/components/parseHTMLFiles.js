/*PARSE THAT THE UPLOADED DOCUMENT IS VALID HTML.
NEED TO BE SURE ITS A VALID HTML FILE,
SUPER EXPLOITABLE*/
function parseUploadedHTMLFile(htmlFile) {

}

/* Create a dummy html element first
(https://stackoverflow.com/questions/10585029/parse-an-html-string-with-js)
Then put in it the contents of the uploaded html file.*/
function createDummyHTML(htmlString) {
    var el = document.createElement( 'html' );
    el.innerHTML = `<html>${htmlString}</html>`;
    return el;
}
