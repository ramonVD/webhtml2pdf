/*PARSE THAT THE UPLOADED DOCUMENT IS VALID HTML, THEN SANITIZE IT AND
RETURN IT AS AN HTML ELEMENT.
PROBABLY TEST SOME MORE AND ADD CHANGES
NOTE: not using sanitizeHtml since our use case documents contain a lot of non-standard
stuff. Using sanitizeHtml removed most of the stuff that also needed to be printed...*/

/*Function to clean an html string of scripts and return a valid html element*/
export const createCleanHTMLElement = (htmlString) => {
    /*Remove everything inside a script tag. Note: Maybe tricks like <script> ... < /script> work
    or not, need to test if that's even valid syntax...*/
    const saneHTML = htmlString.replace(/<script(?:(?!\/\/)(?!\/\*)[^'"]|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\/.*(?:\n)|\/\*(?:(?:.|\s))*?\*\/)*?<\/script>/img, "");
    const htmlElement = document.createElement( 'html' );
    htmlElement.innerHTML = `<!DOCTYPE html><html>${saneHTML}</html>`;
    return htmlElement;
}

/* Check that the string is not empty. Note: The idea was to check here
that it was a valid html construct, but in use cases I was getting some weird pages as 
input without html tags and such, so I'm just checking its non empty*/
export const NonEmptyHTMLString = (string) => {
    if (string === null || string === undefined || string === "") {
        return "";
    }
    return string;
}
