/*Functions to parse the uploaded document, check that its valid html,
then sanitize it.
NOTE: not using sanitizeHtml since our use case documents contain a lot of non-standard
stuff. Using sanitizeHtml removed most of the stuff that also needed to be printed...*/

/*Function to clean an html string of scripts and return a valid html element*/
export const createCleanHTMLElement = (htmlString) => {
    /*Remove everything inside a script tag. Note: Maybe tricks like <script> ... < /script> work...
    or not, need to test if that's even valid syntax that would execute the script...*/
    const saneHTML = 
    htmlString.replace(/<script(?:(?!\/\/)(?!\/\*)[^'"]|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\/.*(?:\n)|\/\*(?:(?:.|\s))*?\*\/)*?<\/script>/img, "");
    const htmlElement = document.createElement( 'html' );
    htmlElement.innerHTML = `<!DOCTYPE html><html>${saneHTML}</html>`;
    removeSuperfluosHeadElements(htmlElement.getElementsByTagName("head")[0]);
    return htmlElement;
}

/* Check that the string is not empty. 
Note: The idea was to check here that it was a valid html construct, but in 
use cases I was getting some weird pages as input without html tags and such,
so in the end just check its non empty. Yeah...*/
export const NonEmptyHTMLString = (string) => {
    if (string === null || string === undefined || string === "") {
        return "";
    }
    return string;
}


/*Remove meta elements, icon links and stuff like that*/
const removeSuperfluosHeadElements = (head) => {
    const headElements = head.querySelectorAll("link, meta");
    const allowedRels = ["preconnect", "stylesheet"];
    for (let el of headElements) {
        if (el.tagName.toLowerCase() === "meta" || !allowedRels.includes(el.rel)) {
            el.remove();
        }
    }
}