import DOMPurify from "dompurify";

/*Functions to parse the uploaded document, check that its valid html,
then sanitize it.*/

/*Setting a whitelist of loaded links is a possibilty,
however last one can change/what about if someone loads external ones
on his document?*/

/*Function to clean an html string of scripts and return a valid html element*/
export const createCleanHTMLElement = (htmlString) => {
    /*Leave these tags (links are the only "dangerous" ones, since iframes 
    will be replaced by another element before being loaded).

    Here I see two options, leave the links, and so when the intended documents'
    stylesheets are updated there's no need to change anything (however, it
    opens a window to exploits using url(...) or stuff like that (maybe???)).

    Or just remove all of the links and use a snapshot of the intended
    stylesheets now. Will need to update when they change.
    
    So far, first option*/
    const sanitizeOptions = {
        WHOLE_DOCUMENT: true,
        ADD_TAGS: ["link", "iframe"]
    }
    const htmlElement = document.createElement( 'html' );
    htmlElement.innerHTML = `<!DOCTYPE html><html>${DOMPurify.sanitize(htmlString,sanitizeOptions)}</html>`;
    //console.log(DOMPurify.removed);
    removeSuperfluousHeadElements(htmlElement.getElementsByTagName("head")[0]);
    return htmlElement;
}

/* Check that the string is not undefined or empty.*/
export const isValidNonEmptyString = (string) => {
    if (string === null || string === undefined || string === "") {
        return false;
    }
    return true;
}


/*Remove meta elements, some icon links (just those, leaves the links to
css stylesheets) and links not included in an approved types array*/
const removeSuperfluousHeadElements = (head) => {
    //Note: DOMPurify removes meta elements, but just in case...
    const headElements = head.querySelectorAll("link, meta");
    const allowedRels = ["preconnect", "stylesheet"];
    for (let el of headElements) {
        if (el.tagName.toLowerCase() === "meta" || !allowedRels.includes(el.rel)) {
            el.remove();
        }
    }
}