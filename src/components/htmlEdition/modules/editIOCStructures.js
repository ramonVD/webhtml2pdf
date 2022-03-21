import { removeIfExists, elementExists, 
  eliminateChildrenUntilFindClass } from "../aux/utils";

/*Check if the element is a IOC book/chapter/page, then apply some cleaning
to its elements depending on the existing selected options.*/
export function cleanIOCStructures(htmlElement, options={}) {
  console.log(htmlElement.innerHTML);

  let text = "";
  if (isIOCBook(htmlElement)) {
    if (options.removeDetails) {
      text = eliminateAllDetails(htmlElement);
    } else {
      eliminateExtraDetails(htmlElement);
    }
    if (options.removeIndex) {
      eliminateContentsTable(htmlElement);
    } 
    if (options.addTitlePage && options.removeDetails) {
      createMainTitlePage(htmlElement, text);
    }
  } else if (isIOCChapter(htmlElement, options)) {
    cleanIOCChapter(htmlElement, options);
  } else if (isIOCPage(htmlElement)) {
    cleanIOCPage(htmlElement);
  }
}

/*Empirical function to eliminate the Contents table from the DOM in a
ioc moodle book*/
function eliminateContentsTable(htmlElement) {
  const indexClasses = `.book_toc_ordered, .book_toc_numbered,
   .book_toc_indented, .book_toc_bullets`;
  const contentsTable = htmlElement.querySelector(indexClasses);
  removeIfExists(contentsTable);
}
  
/*Empirical function based on the default structure of a moodle book in
the IOC campus. Removes the page with details of the book (title, name of 
the book, date of download...)*/
function eliminateAllDetails(htmlElement) {
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
  
/*Function to setup the initial page (that should be empty, so eliminateDetailsPage
  should have been called before (to get the text also)), with a central title.
  Totally empirical too, need to check how to make it always work (so far, it 
    does but need more cases)*/
function createMainTitlePage(htmlElement, text) {
  if (text === "") { return; }
  const rootElement = htmlElement.querySelector("[role='main']");
  const wrapperDiv = document.createElement("div");
  wrapperDiv.style.display = "flex";
  wrapperDiv.style.flexDirection = "column";
  const newTitle = document.createElement("h2");
  newTitle.style.textAlign = "center";
  newTitle.style.verticalAlign = "middle";
  newTitle.style.marginTop = "650px";
  newTitle.style.marginLeft = "-10px";
  newTitle.style.fontSize = "40px";
  newTitle.style.alignSelf = "center";
  newTitle.innerText = text;
  wrapperDiv.appendChild(newTitle);
  rootElement.insertBefore(wrapperDiv, rootElement.firstChild);
}

/*Empirical function to remove navbars and assorted DOM junk from IOC 
campus standard pages (not books or chapters).
Also stops limiting page width to 720px and sets the background color
to white, like what you'd see in the real page in the campus.
Maybe add to it more in the future, it works so far but needs more
testing on real world stuff.*/
function cleanIOCPage(htmlElement) {
    const classesToRemove = `.navbar-nav, .popover-region, .popover-region-container,
      .moodle-has-zindex, #page-header, .block_book_toc, .urlselect, #page-footer,
      .navbottom, .m-t-2, .menubar, #region-main-settings-menu, .region_main_settings_menu_proxy,
      .navtop, .modified`;
    htmlElement.querySelectorAll(classesToRemove).forEach( nav => nav.remove() );
    
    //Remove main card wrapping the body of the content and set white bg
    const mainWrapperCard = htmlElement.querySelector("#region-main > .card");
    htmlElement.querySelector("body").style.backgroundColor = "#FFF";
    mainWrapperCard.classList.remove("card");
    mainWrapperCard.querySelector(".card-body").classList.remove("card-body");
    //Theres a css rule targetting this role that also messes margins, remove it
    htmlElement.querySelector('[role="main"]').setAttribute("role", "");
}

/*Just change main book title and margins. Rest should be fine*/
function cleanIOCChapter(htmlElement, options) {
  const firstTitle = htmlElement.querySelector("h1");
  firstTitle.classList.add("my-3");
  const changeHeaderFontValue = options.selectedFontType === "em" ? 0.2 : 2;
  const baseTitleFont = firstTitle.style.fontSize;
  const finalFontSize = parseFloat(parseFloat(baseTitleFont) + changeHeaderFontValue)
   + options.selectedFontType;
  firstTitle.style.fontSize = finalFontSize;
}

/*Empirical functions to check if there are characteristic (now) classes
of books, chapters or pages of ioc moodle documents*/

  /*Returns true if its a full ioc moodle book*/
function isIOCBook(htmlElement) {
  return htmlElement.querySelector(".book_info") !== null;
}

/*Returns true if its a single chapter from a ioc moodle book*/
function isIOCChapter(htmlElement) {
  return htmlElement.querySelector(".hidden-print") !== null;
}

/*Returns true if its a ioc page that's been downloaded manually*/
function isIOCPage(htmlElement) {
  return htmlElement.querySelector(".ioc-xtec-cat--campus") !== null;
}

/*Details page still may exist. If it does, remove the two last
elements of its table, since they show data that should not be shown*/
function eliminateExtraDetails(htmlElement) {
  const bookDetailsTable = htmlElement.querySelector(".book_info");
  let tableDetails;
  if (elementExists(bookDetailsTable)) { 
    tableDetails = bookDetailsTable.querySelector("table");
    bookDetailsTable.classList.add("mb-4");
    }
  if (elementExists(tableDetails)) {
    // Elimina els apartats Imprès per i data
    tableDetails.deleteRow(-1);
    tableDetails.deleteRow(-1);
  }
}

export default cleanIOCStructures;
