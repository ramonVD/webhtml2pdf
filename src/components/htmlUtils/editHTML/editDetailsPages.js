  import { removeIfExists, elementExists } from "./aux/utils";

  /*Empirical function to eliminate the Contents table from the DOM in the
  ioc moodlebook*/
  export function eliminateContentsTable(htmlElement) {
    const contentsTable = htmlElement.querySelector(".book_toc_ordered, .book_toc_numbered");
    removeIfExists(contentsTable);
  }
  
  /*Totally empirical function based on the default structure of a moodle book in
  the IOC campus. Removes the page with details of the book (title, name of 
  the book, date of download...)*/
  export function eliminateDetailsPage(htmlElement) {
    const firstDiv = htmlElement.querySelector("div");
    if (firstDiv.id !== "page-wrapper") {
        removeIfExists(firstDiv);
    }
    const titleTextElement = htmlElement.querySelector("h1");
    const titleText = elementExists(titleTextElement) ? titleTextElement.innerText : "";
    const rootElement = htmlElement.querySelector("[role='main']");
    eliminateChildrenUntilFindClass( rootElement, "book_info");
    const indexTableDiv = htmlElement.querySelector(".book_info");
    removeIfExists(indexTableDiv);
    return titleText;
  }
  
  /*Function to setup the initial page (that should be empty, so eliminateDetaisPage
    should have been called before (to get the text also)), with a central title.
    Totally empirical too, need to check how to make it always work (so far, it 
      does but need more cases)*/
  export function createMainTitlePage(htmlElement, text) {
    if (text === "") { return; }
    const rootElement = htmlElement.querySelector("[role='main']");
    const wrapperDiv = document.createElement("div");
    wrapperDiv.style.display = "flex";
    wrapperDiv.style.flexDirection = "column";
    const newTitle = document.createElement("h2");
    newTitle.style.textAlign = "center";
    newTitle.style.verticalAlign = "middle";
    newTitle.style.marginTop = "650px";
    newTitle.style.marginLeft = "-50px";
    newTitle.style.fontSize = "40px";
    newTitle.style.alignSelf = "center";
    newTitle.innerText = text;
    wrapperDiv.appendChild(newTitle);
    rootElement.insertBefore(wrapperDiv, rootElement.firstChild);
  }
  
  /*Eliminates children elements of the parent node until an element
  with the desired class has been found. Careful with this.*/
  function eliminateChildrenUntilFindClass(parentNode, className) {
    if (!elementExists(parentNode)) { return; }
    const children = parentNode.children;
    for (let childElement of Array.from(children)) {
      if (childElement.classList.contains(className)) {
        break;
      }
      childElement.remove();
    }
  }
  
  /*Empirical function to remove navbars and assorted DOM junk from IOC 
  campus standard pages (not books). Honestly not needed, program should not be
  used on non book pages. Maybe add to it more in the future, it works so far
  but needs more testing on real world stuff*/
  export function cleanIOCChapter(htmlElement) {
      const classesToRemove = `.navbar-nav, .popover-region, .popover-region-container,
       .moodle-has-zindex, #page-header, .block_book_toc, .urlselect, #page-footer,
       .navbottom, .m-t-2, .menubar, #region-main-settings-menu, .region_main_settings_menu_proxy, .navtop`
      htmlElement.querySelectorAll(classesToRemove).forEach( nav => nav.remove() );
  }