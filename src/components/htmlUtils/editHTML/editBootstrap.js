/*functions to fix some bootstrap idiosincracies when printing*/
import { elementExists } from "./aux/utils";

//BOOTSTRAP - TABLES

/*Sets up the background of all elements inside tables to show up when printing*/
export function setupTableElementsForPrint(htmlElement) {
    Array.from(htmlElement.getElementsByTagName("table")).forEach( 
        table => fixTableBackground(table) );
}

/*Assigns the background to each element that has one as important, so itll show up
despite the default styles applied.*/
const fixTableBackground = (table) => {
    const tableChildren = Array.from(table.querySelectorAll("tr, td, th"));
    tableChildren.forEach( tableChild => {
        if (tableChild.style.backgroundColor !== "") {
            propagateBgColorToCells(tableChild, tableChild.style.backgroundColor);
        } else {
            //Check if it has bootstrap classes applied, then set that bg color to important
            const classList = Array.from(tableChild.classList);
            if (classList.length > 0) {
                const tableClassMatch = classList.join(",").match(/table-(\w+)/);
                if (tableClassMatch && tableClassMatch[1].length > 0) {
                    //match a la posicio 1 és el tipus de bg:
                    const finalbgColor = getBootstrapTableColor(tableClassMatch[1]);
                    if (finalbgColor !== "") {
                        propagateBgColorToCells(tableChild, finalbgColor);
                    }
                }
            }
        }
    });
}

/*Translate table-* classes in bootstrap to their colors in hex*/
function getBootstrapTableColor(bootstrapClassName) {
    switch (bootstrapClassName) {
        case "primary":
            return "#b8daff";
        case "secondary":
            return "#d6d8db";
        case "active":
            return "#ececec";
        case "success":
            return "#c3e6cb";
        case "danger":
            return "#f5c6cb";
        case "warning":
            return "#ffeeba";
        case "info":
            return "#bee5eb";
        case "light":
            return "#fdfdfe";
        case "dark":
            return "#212529";
        default:
            return "";
      }
}

/* Applies the color to the cell or, in the case of rows, to all cells in the row.
Needed because apparently row background colors arent shown while printing? (atleast on firefox)*/
function propagateBgColorToCells(mainElement, color) {
    if (mainElement.tagName.toLowerCase() === "tr") {
        Array.from(mainElement.querySelectorAll("td, th")).forEach ( cell => {
            cell.style.setProperty("background-color", color , "important");});
    } else {
        mainElement.style.setProperty("background-color", color , "important");
    }
}


// BOOTSTRAP - NAVS (PESTANYES) & COLLAPSE

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
    var collapsables = htmlElement.querySelectorAll(".collapse");
    collapsables.forEach(function(collapsable) {
        collapsable.style.display = "block";
        const collapsedID = collapsable.id;
        const relatedLink = htmlElement.querySelector(`[href='#${collapsedID}']`);
        /*This link doesnt make sense on a pdf (its just to relate both elements so
        clicking on one opens the other), just remove it*/
        if (elementExists(relatedLink)) { relatedLink.href = ""; }
    });
    var tabsContainers = htmlElement.querySelectorAll(".tab-content");
    tabsContainers.forEach(function(tabsContainer) {
        const modifiedTabContainer = explodeNavContainer(tabsContainer);
        //Not a normal bootstrap structure, just show all content one after the other
        if (!modifiedTabContainer) {
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
            /*Maybe make this optional... (but if I dont do this, it's just the default
            "active" color, which doesnt differentiate it much from the content*/
            internalLink.style.setProperty("background-color", "#f8f9fa", "important");
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

function isUl(element) {
  return element.tagName.toLowerCase() === "ul";
}


/*Apparently unneeded, bootstrap should be loaded correctly*/
/*const BOOTSTRAP_HREF = "https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css";*/

/*const createBootstrapLink = () => {
    const bootstrapLink = document.createElement('link');
    bootstrapLink.rel = 'stylesheet';
    bootstrapLink.href = BOOTSTRAP_HREF;
    bootstrapLink.integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T";
    bootstrapLink.crossOrigin="anonymous";
    return bootstrapLink;
}*/

