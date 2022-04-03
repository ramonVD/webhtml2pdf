import { elementExists, removeIfExists, 
    eliminateChildrenUntilFindClass } from "./utils";
/*Empirical functions to check if there are characteristic (now) classes
of books, chapters or pages of ioc moodle documents, and 
get the element / remove it*/


/*Returns true if its a full ioc moodle book*/
export function isIOCBook(htmlElement) {
    return htmlElement.querySelector(".book_info") !== null;
}

/*Returns true if its a single chapter from a ioc moodle book*/
export function isIOCChapter(htmlElement) {
    return htmlElement.querySelector(".hidden-print") !== null;
}

/*Returns true if its a ioc page that's been downloaded manually*/
export function isIOCPage(htmlElement) {
    return htmlElement.querySelector(".ioc-xtec-cat--campus") !== null;
}

/*Moodle has some default names for its index table, maybe some more even?
They can be found in the css files for print.css for example, should
check that all of them are included...*/
export const getIndexTable = (htmlElement) => {
    const indexClasses = `.book_toc_ordered, .book_toc_numbered,
    .book_toc_indented, .book_toc_bullets, .book_toc_none`;
    return htmlElement.querySelector(indexClasses);
}


/*Empirical function based on the default structure of a moodle book in
the IOC campus. Removes the page with details of the book (title, name of 
the book, date of download...)*/
export function eliminateAllDetails(htmlElement) {
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

/*If details page exists, remove the two last
elements of its table, since they show data that should not be shown*/
export function eliminateExtraDetails(htmlElement) {
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

/*Removes all index links*/
export function eliminateIndexTable(htmlElement) {
    const indexTable = getIndexTable(htmlElement);
    removeIfExists(indexTable);
}