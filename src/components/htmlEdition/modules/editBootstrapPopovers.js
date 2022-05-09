
const getPopovers = (htmlElement) => htmlElement.querySelectorAll("*[data-content]");

/* Adds after apopover element, another element that shows its contents.
 (popovers cant be shown in pdf when hovered or clicked).
 By default, the new element is a bootstrap card element with its title/contents.
 Technically the insertion is after the element that contains the popover.
 Maybe add option to toggle this behavior to show popover after parent content/
 after the popover text.
*/
function showPopoverContents(htmlElement, options) {
    const popovers = getPopovers(htmlElement);
    Array.from(popovers).forEach(popover => {
        const popoverValues = getPopoverValues(popover);
        const title = (popoverValues[0] === undefined) ? undefined : createTitleWrapper(popoverValues[0])
        const content = createContentWrapper(popoverValues[1]);
        const popoverRepresentation = createPopoverRepresentation(title, content, options.popoverCenter);
        if (options.popoverAfter) {
            popover.parentNode.insertAdjacentElement("afterend", popoverRepresentation);
        } else {
            popover.insertAdjacentElement("afterend", popoverRepresentation);
        }
    });
}

/* Gets the popover title and content data, from its DOM possible attributes
values, as an array with two values. Title will be undefined if no value
was found in its possible attributes. Content can only be empty string if 
nothing was found, not undefined. This is how popvers work to my understanding
(title may show if it exists, content always shows) -> [string, string] */
const getPopoverValues = (popover) =>  {
    const possTitleAttrs = ["title", "data-title", "data-original-title", "fk"];
    const possContentAttrs = ["data-content", "data-original-content"];

    const realTitle = possTitleAttrs
    .map(attrName =>  getExistingAttrValue(popover, attrName))
    .filter(attrValue => attrValue !== "");
    const realContent = possContentAttrs
    .map(attrName =>  getExistingAttrValue(popover, attrName))
    .filter(attrValue => attrValue !== "");
    const finalTitle = (realTitle.length > 0) ? realTitle[0] : undefined;
    const finalContent = (realContent.length > 0) ? realContent[0] : "";
    return [finalTitle, finalContent];
}

const getExistingAttrValue = (htmlElement, attrName) => {
    const attrValue = htmlElement.getAttribute(attrName);
    if (attrValue !== null && attrValue !== undefined) {
        return attrValue;
    }
    return "";
}

const createTitleWrapper = (title) => {
    const wrapper = document.createElement("h5");
    //apply styles here
    wrapper.innerHTML = title;
    return wrapper;
}


const createContentWrapper = (content) => {
    const wrapper = document.createElement("div");
    //apply styles here
    wrapper.classList.add("card-text");
    wrapper.innerHTML = content;
    return wrapper;
}

const createPopoverRepresentation = (titleElement, contentElement, centerPopover) => {
    const card = document.createElement("div");
    const wrapper = document.createElement("div");
    card.classList.add("card");
    if (centerPopover) {
        card.classList.add("text-center");
    }
    wrapper.classList.add("card-body");
    if (titleElement !== undefined) {
        wrapper.appendChild(titleElement);
    }
    wrapper.appendChild(contentElement);
    card.append(wrapper);
    return card;
}

export default showPopoverContents;