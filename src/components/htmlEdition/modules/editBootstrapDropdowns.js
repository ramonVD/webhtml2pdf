import { isUl } from "../aux/utils";

//Shows contents of bootstrap dropdowns after their clickable/hoverable element
export const fixDropdowns = (htmlElement) => {
    const dropdownedElements = getDropdownedElements(htmlElement);
    let dropdownAmount = 0;
    Array.from(dropdownedElements).forEach( el => { 
        //Create a new div that will contain the contents of the old
        //dropdown element, then insert it after dropdown.
        const newEl = isUl(el) ? document.createElement("ul") : document.createElement("div");
        newEl.innerHTML = el.innerHTML;

        //This fixes styles for old dropdown versions that were a ul
        //with multiple lis instead of a div with multiple as
        newEl.style.listStyleType = "none";

        /*NOTE: I do not add the dropdown-menu class to the new element,
        it caused problems since it had so many applied styles. So
        far it works well, but if needed, apply the class and fix
        all the styles (probably need to fix parent's too...)*/

        //Just for identification purposes on tests...
        newEl.id = "ddcontent" + dropdownAmount;
        dropdownAmount++;
        el.parentNode.after(newEl);
        el.remove();
    })    
}

//Returns elements that are inside a dropdown element
const getDropdownedElements = (htmlElement) => 
        htmlElement.querySelectorAll(".dropdown-menu");

export default fixDropdowns;