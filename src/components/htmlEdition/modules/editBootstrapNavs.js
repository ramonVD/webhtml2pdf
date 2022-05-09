import { elementExists, isUl } from "../aux/utils";

// BOOTSTRAP - FIX NAVS (PESTANYES) & COLLAPSE FOR PRINT

/*Per defecte aplica padding i margin i assigna un color a la vora inferior 
    de cada tab-pane (excepte l'últim) dins un element amb "pestanyes". Canviar aquí.*/
const defaultOpenedTabsCSS = {
    PADDING_INFERIOR_TABS: 10,
    MARGIN_INFERIOR_TABS: 15,
    VORA_INFERIOR_TABS: "2px solid black"
}

/*Opens all collapsable elements and explodes nav elements (if able, if not
    it just shows all of its content one after the other
    (no clicking tabs in a pdf...))*/
export function openAllCollapsablesAndTabs(htmlElement, cssOptions) {
    if (cssOptions === undefined) { cssOptions = defaultOpenedTabsCSS; }
    const collapsables = htmlElement.querySelectorAll(".collapse");
    collapsables.forEach( (collapsable) => {
        fixCollapsable(collapsable, htmlElement);
    });
    const tabsContainers = htmlElement.querySelectorAll(".tab-content");
    tabsContainers.forEach( (tabsContainer) => {
        const modifiedTabContainer = explodeNavContainer(tabsContainer);
        if (!modifiedTabContainer) {
            fixNonDefaultTabsContainerStyles(tabsContainer, cssOptions);
        }
    });
}

/*Opens a collapsable and removes its internal referencing links*/
const fixCollapsable = (collapsable, htmlElement) => {
    collapsable.style.display = "block";
    const collapsedID = collapsable.id;
    if (collapsable.style.height === "0px") { 
        collapsable.style.height = ""; 
    }
    const relatedLink = htmlElement.querySelector(`[href='#${collapsedID}']`);
    /*This link doesnt make sense on a pdf (its just to relate both elements so
    clicking on one opens the other), just remove it*/
    if (elementExists(relatedLink)) { 
        relatedLink.href = ""; 
    }
}

/*Function to fix a non default nav structure. Just show all content panels
one after the other, and all titles will be on top*/
const fixNonDefaultTabsContainerStyles = (tabsContainer, cssOptions) => {
    const tabs = tabsContainer.querySelectorAll(".tab-pane");
    tabs.forEach(function(tab, index, array) {
        tab.style.display = "block";
        tab.style.opacity = "1";
        tab.style.marginBottom = (parseInt(tab.style.marginBottom) || 0) + cssOptions.MARGIN_INFERIOR_TABS + "px";
        tab.style.paddingBottom = (parseInt(tab.style.paddingBottom) || 0) + cssOptions.PADDING_INFERIOR_TABS + "px";
        if (index < array.length - 1) {
            tab.style.borderBottom = cssOptions.VORA_INFERIOR_TABS;
        }
    });
}

/*Copies the structure of a nav element, but instead of showing all titles on top
(which normally makes sense b/c you can navigate to each titles' corresponding content
by clicking on it), it now groups title and content, showing blocks consisting of
a title, and under it, the titles' corresponding content.
Will only work on bootstrap defaul nav structures*/
const explodeNavContainer = (tabContentElement) => {
    const titles = [];
    const tabPanes = [];

    /*A valid tab content element must have its index in a ul just before it in
    the DOM*/
    let navLinkList = tabContentElement.previousElementSibling;
    navLinkList = isUl(navLinkList) ? navLinkList : ""; 
    if (navLinkList === "") { return false; } //Not a valid structure...

    Array.from(tabContentElement.children).forEach (possibletabPane => {
        if (possibletabPane.classList.contains("tab-pane")) {
            //Modify bootstrap classes so they always show;
            possibletabPane.classList.remove("fade");
            possibletabPane.classList.add("active");
            possibletabPane.classList.add("show");
            tabPanes.push(possibletabPane.cloneNode(true));
        }
    });
    Array.from(navLinkList.children).forEach (li => {
        const internalLink = li.querySelector("a");
        if (elementExists(internalLink)) {
            internalLink.classList.add("active");
            internalLink.classList.add("show");
            internalLink.href = "";
            li.classList.add("mb-0");
            /*Optional... (if I dont do this, it's just the default
            "active" color, which doesnt differentiate it much from the content
            internalLink.style.setProperty("background-color", "#f8f9fa", "important");*/
        }
        titles.push(li.cloneNode(true));
    });

    /*There should be a title for every tab panel in a valid structure...*/
    if (titles.length !== tabPanes.length) { return false; }
    const wrapper = document.createElement("div"); 
    for (let position in titles) {
        const navLinkListContainerCopy = navLinkList.cloneNode(false);
        const tabContentElementCopy = tabContentElement.cloneNode(false);
        tabContentElementCopy.classList.add("mb-2");
        const titleCopy = titles[position];
        navLinkListContainerCopy.appendChild(titleCopy);

        wrapper.append(navLinkListContainerCopy);
        const tabPaneCopy = tabPanes[position];
        tabContentElementCopy.append(tabPaneCopy);

        wrapper.append(tabContentElementCopy);
    }
    //Remove title list and substitute the tab panel for the exploded copy
    navLinkList.remove();
    tabContentElement.parentNode.replaceChild(wrapper, tabContentElement);
    return true;
}



export default openAllCollapsablesAndTabs;
