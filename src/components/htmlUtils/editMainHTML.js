import { replaceVideosWithLink, createVideosThumbnail } from "./editHTML/editVideos";
import {setupTableElementsForPrint, 
  openAllCollapsablesAndTabs} from "./editHTML/editBootstrap";
import cleanIOCBookOrChapter from "./editHTML/editDetailsPages";
import { editBody, editHeaders} from "./editHTML/editCommonElements";
import applyChangesToUserSelectors from "./editHTML/applyUserChanges";
import { FindByStyleAttr } from "./editHTML/aux/utils";
/*
MORE THINGS TO DO:

-AS AN OPTION
  -ELIMINATE FIRST TWO PAGES OF THE DOCUMENT (book definition/campus stuff + unusable anchors) - DONE
    --NEED TO HOOK THESE TO OPTIONS. ALSO AN OPTION TO CLEAN THE BOOK (DONE)
    -- OR: FIGURE A WAY TO MAKE THE ANCHORS TO CHAPTERS WORK (TRIED A LOT OF STUFF, NO LUCK SO FAR)

-CONSIDER IF OPTION OR DO IT ALWAYS:
  -ELIMINATE LINKS FROM ACCORDION BUTTONS AND SIMILAR

-GOTTA DO IT:
  -PELS ELEMENTS DE PESTANYES, POSA EL TITOL DE CADA PESTANYA SOBRE EL SEU CONTINGUT, EN COMPTES DE 
  QUE NOMÉS ESTIGUI A SOBRE DEL PRIMER ELEMENT.

  /*Fixing image breaking between two pages when printing is not possible according to
    https://stackoverflow.com/questions/34534231/page-break-insideavoid-not-working
    because or DOM tree has flex styled grandparents, which are needed... Added the media
    query in the CSS but that's not reliable.*/



/*
Changes to apply to an html document before the choice to print it as a pdf
document is displayed. Need to make modular as it grows.
*/

export async function editHTML(htmlElement, options) {
    //console.log(htmlElement.innerHTML);

    //Increase body and headers base or total font
    if (options.bodyFontSize === "" || options.bodyFontSize < 0) { options.bodyFontSize = 1;}
    const MIDA_FONT_BASE = options.bodyFontSize + options.selectedFontType;
    const changeHeaderFontValue = options.selectedFontType === "em" ? 0.2 : 2;
    //Very empirical, and very cool
    const MIDA_FONT_HEADERS = parseFloat(parseFloat(options.bodyFontSize) - changeHeaderFontValue)
     + options.selectedFontType;
    

    editBody(htmlElement, MIDA_FONT_BASE);
    editHeaders(htmlElement, MIDA_FONT_HEADERS );

    openAllCollapsablesAndTabs(htmlElement);

    setupTableElementsForPrint(htmlElement);

    //Increase font size of elements with a defined font-size in px too.
    if (options.increaseFixedSize === "" || options.increaseFixedSize < 0) { options.increaseFixedSize = 0;}
    const AUGMENTAR_MIDA_FONT_PX = parseInt(options.increaseFixedSize);
    increaseElementsFontSize(FindByStyleAttr(htmlElement, "fontSize"), AUGMENTAR_MIDA_FONT_PX);

    if (options.videoImgsState === 0) {
      replaceVideosWithLink(htmlElement);
    } else {
      await createVideosThumbnail(htmlElement, options.videoImgsState > 1);
    }
     
    if (options.noNbsp) {
      removeNBSP(htmlElement);
    }

    cleanIOCBookOrChapter(htmlElement, options);

    applyChangesToUserSelectors(htmlElement, options.elementSizeArray);

    return htmlElement;
  }


  function increaseElementsFontSize(elements, amount) {
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