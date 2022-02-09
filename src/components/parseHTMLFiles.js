import sanitizeHtml from 'sanitize-html';
/*PARSE THAT THE UPLOADED DOCUMENT IS VALID HTML, THEN SANITIZE IT AND
RETURN IT AS AN HTML ELEMENT.
SUPER EXPLOITY, NEED TO ADD CHECKS*/
export const createDummyHTML = (htmlString) => {
    const saneHTML = sanitizeHtml(htmlString);
    const htmlElement = document.createElement( 'html' );
    htmlElement.innerHTML = `<html>${saneHTML}</html>`;
    return htmlElement;
}

/* Expand a looot on this*/
export const validateHTMLString = (string) => {
    if (string === null || string === undefined || string === "") {
        return "";
    }
    return string;
}
