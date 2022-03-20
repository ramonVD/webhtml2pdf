import { replaceVideosWithLink, createVideosThumbnail } from "./modules/editVideos";
import {setupTableElementsForPrint, 
  openAllCollapsablesAndTabs} from "./modules/editBootstrapElements";
import cleanIOCBookOrChapter from "./modules/editDetailsPages";
import { editBody, editHeaders} from "./modules/editCommonElements";
import applyUserChangesToSelectors from "./modules/applyUserChanges";
import { nonEditableOptions } from "../fileuploader/optionsList/optionsState";
import { FindByStyleAttr } from "./aux/utils";
/*
Apply modifications to the DOM of an html document before the choice to
print it as a pdf document is displayed.
*/

export async function editHTML(htmlElement, options) {
  
    //Increase body and headers base or total font
    if (options.bodyFontSize === "" || options.bodyFontSize < 0) { options.bodyFontSize = 1;}
    const MIDA_FONT_BASE = options.bodyFontSize + options.selectedFontType;
    const changeHeaderFontValue = options.selectedFontType === "em" ? 0.2 : 2;
    //Very empirical, and very cool
    const MIDA_FONT_HEADERS = parseFloat(parseFloat(options.bodyFontSize) - changeHeaderFontValue)
     + options.selectedFontType;
    

    editBody(htmlElement, MIDA_FONT_BASE);
    editHeaders(htmlElement, MIDA_FONT_HEADERS);

    openAllCollapsablesAndTabs(htmlElement, nonEditableOptions.navs);

    setupTableElementsForPrint(htmlElement);

    //Increase font size of elements with a defined font-size in px too.
    if (options.increaseFixedSize === "" || options.increaseFixedSize < 0) { options.increaseFixedSize = 0;}
    const AUGMENTAR_MIDA_FONT_PX = parseInt(options.increaseFixedSize);
    increaseElementsFixedFontSize(FindByStyleAttr(htmlElement, "fontSize"), AUGMENTAR_MIDA_FONT_PX);

    if (options.videoImgsState === 2) {
      replaceVideosWithLink(htmlElement);
    } else {
      await createVideosThumbnail(htmlElement, options.videoImgsState > 0);
    }
     
    if (options.noNbsp) {
      removeNBSP(htmlElement);
    }

    cleanIOCBookOrChapter(htmlElement, options);

    //Possible non blocking error if user sets a bad selector (doesnt exist or is a weird string)
    const selectorErrors = applyUserChangesToSelectors(htmlElement, options.userEdits);

    let errorsData = "";
    const erroneousSelectors = selectorErrors.filter(el => el !== "");
    if (erroneousSelectors.length > 0) {
      const firstPhrase = selectorErrors.length > 1 ? "Selectors invàlids:  " :
          "Selector invàlid:  ";
      errorsData = firstPhrase + erroneousSelectors.join(", ");
    }

    return {html: htmlElement, errorsData: errorsData};
  }


  function increaseElementsFixedFontSize(elements, amount) {
    elements.forEach(function(element) {
      const OGFontSize = element.style.fontSize;
      if (/pt|px/.test(OGFontSize)) {
        const OGNumber = parseInt(OGFontSize.replace(/\D+/g, ""));
        const newNumber = parseInt(OGNumber + amount);
        element.style.fontSize = newNumber + "px";
      }
    });
  }

  function removeNBSP(htmlElement) {
    const ps = htmlElement.querySelectorAll("p");
    ps.forEach( function(el) {
        el.innerHTML = el.innerHTML.replace(/&nbsp;/g, " ");
      });
  }

export default editHTML;