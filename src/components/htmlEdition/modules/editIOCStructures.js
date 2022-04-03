import * as ioc from "../aux/IOCElements";

/*Note: By empirical, I mean that the function uses current default classes
or attributes that exist in the current DOM used in IOC Campus' documents
(as of march 2022). If it changes, they will probably need changing too*/

/*Check if the element is a IOC book/chapter/page, then apply some cleaning
to its elements depending on the existing selected options.*/
export function cleanIOCStructures(htmlElement, options={}) {
  let text = "";
  if (ioc.isIOCBook(htmlElement)) {
    if (options.removeDetails) {
      text = ioc.eliminateAllDetails(htmlElement);
    } else {
      ioc.eliminateExtraDetails(htmlElement);
    }
    if (options.removeIndex) {
      ioc.eliminateIndexTable(htmlElement);
    } else {
      fixIndexLinks(htmlElement);
    }
    if (options.addTitlePage && options.removeDetails) {
      createMainTitlePage(htmlElement, text);
    }
  } else if (ioc.isIOCChapter(htmlElement, options)) {
    cleanIOCChapter(htmlElement, options);
  } else if (ioc.isIOCPage(htmlElement)) {
    cleanIOCPage(htmlElement);
  }
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

/*Fixes the links of the index page, for now it removes their links
and the underlines to make them not seem links.
NOTE: I've tried making them pdf anchors multiple times, 
couldnt make it work.
Also, the commented part sets the link to the current course page,
but since they change every three months this is probably not wanted...*/
function fixIndexLinks(htmlElement) {
  const index = ioc.getIndexTable(htmlElement);
  const indexListElements = Array.from(index.querySelectorAll("ul > li"));
  const bookLinks = index !== undefined ? Array.from(index.querySelectorAll("a")).filter( el => el.href !== "" ) : [];
  if (bookLinks.length > 0) { 
    indexListElements.forEach( subLi => {
      //Fixes styles of subTitles
      subLi.style.setProperty("list-style", "none", "important");
    })
    bookLinks.filter( el => { 
      el.removeAttribute("href");
      //Simulate its style with href
      el.style.color = "#2a84f9";
      el.style.textDecoration = "none"; 
      return false;
    });
  }

  /*const bodyClasses = Array.from(htmlElement.getElementsByTagName("body")[0].classList).filter( el => el.match(/cmid-(\d+)/));
  const bookRootLink = bodyClasses.length > 0 ? bodyClasses[0].match(/\d+/)[0] : undefined;
  const index = ioc.getIndexTable(htmlElement);
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
