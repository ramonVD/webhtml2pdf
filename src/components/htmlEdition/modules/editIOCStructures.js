import { removeIfExists, elementExists, 
  eliminateChildrenUntilFindClass } from "../aux/utils";

/*Note: By empirical, I mean that the function uses current default classes
or attributes that exist in the current DOM used in IOC Campus' documents
(as of march 2022). If it changes, they will probably need changing too*/

/*Check if the element is a IOC book/chapter/page, then apply some cleaning
to its elements depending on the existing selected options.*/
export function cleanIOCStructures(htmlElement, options={}) {
  let text = "";
  if (isIOCBook(htmlElement)) {
    if (options.removeDetails) {
      text = eliminateAllDetails(htmlElement);
    } else {
      eliminateExtraDetails(htmlElement);
    }
    if (options.removeIndex) {
      eliminateIndexTable(htmlElement);
    } else {
      fixIndexLinks(htmlElement);
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
function eliminateIndexTable(htmlElement) {
  const indexTable = getIndexTable(htmlElement);
  removeIfExists(indexTable);
}

/*Moodle has some default names for its index table, maybe some more even?
  They can be found in the css files for print.css for example, should
  check that all of them are included...*/
const getIndexTable = (htmlElement) => {
  const indexClasses = `.book_toc_ordered, .book_toc_numbered,
  .book_toc_indented, .book_toc_bullets`;
  return htmlElement.querySelector(indexClasses);
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

/*Fixes the links of the index page, for now it removes their links
and the underlines to make them not seem links.
NOTE: I've tried making them pdf anchors multiple times, 
couldnt make it work.
Also, the commented part sets the link to the current course page,
but since they change every three months this is probably not wanted...*/
export function fixIndexLinks(htmlElement) {
  const index = getIndexTable(htmlElement);
  const bookLinks = index !== undefined ? Array.from(index.querySelectorAll("a")).filter( el => el.href !== "" ) : [];
  if (bookLinks.length > 0) { 
    bookLinks.filter( el => { 
      //Workaround, without it in chrome it sets up a valid link to the base url of the window
      //https://stackoverflow.com/questions/5637969/is-an-empty-href-valid
      // eslint-disable-next-line no-script-url
      el.href = `javascript:void(0);`;
      el.style.textDecoration = "none"; 
      return false;
    });
  }

  /*const bodyClasses = Array.from(htmlElement.getElementsByTagName("body")[0].classList).filter( el => el.match(/cmid-(\d+)/));
  const bookRootLink = bodyClasses.length > 0 ? bodyClasses[0].match(/\d+/)[0] : undefined;
  const index = getIndexTable(htmlElement);
  const bookLinks = index !== undefined ? Array.from(index.querySelectorAll("a")).filter( el => el.href !== "" ) : [];
  if (bookLinks.length > 0) {
    let chapterNum;
    for (const a of bookLinks) {
      chapterNum = a.href.match(/\d+$/);
      if (chapterNum[0] && bookRootLink) {
        a.href = getBookIndex(bookRootLink, chapterNum);
      }
    }
  }*/
}

/*Unused function to get the url of a specific book/chapter in the campus
const getBookIndex = (bookId, chapterNum) => {
  return `https://ioc.xtec.cat/campus/mod/book/view.php?id=${bookId}&chapterid=${chapterNum}`;
}*/

export default cleanIOCStructures;
