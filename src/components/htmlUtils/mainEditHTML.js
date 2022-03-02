import { replaceVideosWithLink, createVideosThumbnail } from "./editHTML/editVideos";

/*
Changes to apply to an html document before the choice to print it as a pdf
document is displayed. Need to make modular as it grows
*/
const BOOTSTRAP_HREF = "https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css";

export function editHTML(htmlElement, options) {

    /*Inserta la llibreria de bootstrap al document, ja que per defecte l'eliminem abans al sanititzar l'html.
    Posar-ho com una opció potser millor?*/
    htmlElement.getElementsByTagName("head")[0].appendChild(createBootstrapLink());


    /*Per defecte aplica padding i margin i assigna un color a la vora inferior 
      de cada tab-pane (excepte l'últim) dins un element amb "pestanyes". Canviar aquí.*/
    const openedTabsCSS = {
      PADDING_INFERIOR_TABS: 10,
      MARGIN_INFERIOR_TABS: 15,
      VORA_INFERIOR_TABS: "2px solid black"
    }
    //Canviar la nova mida de la font a conveniencia
    //Pot arribar la opcio buida, en teoria mai negativa però per si de cas...
    if (options.bodyFontSize === "" || options.bodyFontSize < 0) { options.bodyFontSize = 0;} //potser 1?
    const MIDA_FONT = options.bodyFontSize + options.selectedFontType;
    //Augmenta la mida de lletra amb mida fixa, p.ex 16px -> 20px
    if (options.increaseFixedSize === "" || options.increaseFixedSize < 0) { options.increaseFixedSize = 0;}
    const AUGMENTAR_MIDA_FONT_PX = options.increaseFixedSize;

    /*Fixing image breaking between two pages when printing is not possible according to
    https://stackoverflow.com/questions/34534231/page-break-insideavoid-not-working
    because or DOM tree has flex styled grandparents, which are needed... Added the media
    query in the CSS but that's not reliable.*/
    
    //Increase body font size
    htmlElement.getElementsByTagName("body")[0].style.fontSize = MIDA_FONT;

    openAllCollapsablesAndTabs(htmlElement, openedTabsCSS);

    //Increase font size of elements with a defined font-size in px too.
    increaseElementsFontSize(FindByStyleAttr(htmlElement, "fontSize"), AUGMENTAR_MIDA_FONT_PX);

    if (options.videoLinkOnly) {
      replaceVideosWithLink(htmlElement);
    } else {
      createVideosThumbnail(htmlElement);
    }
     
    if (options.noNbsp) {
      removeNBSP(htmlElement);
    }

    eliminateBookExtraDetails(htmlElement);

    return htmlElement;
  }


  function openAllCollapsablesAndTabs(htmlElement, cssOptions) {
    var collapsables = htmlElement.querySelectorAll(".collapse");
    collapsables.forEach(function(collapsable) {
      collapsable.style.display = "block";
    });
    var tabsContainers = htmlElement.querySelectorAll(".tab-content");
    tabsContainers.forEach(function(tabsContainer) {
      var tabs = tabsContainer.querySelectorAll(".tab-pane");
      tabs.forEach(function(tab, index, array) {
        tab.style.display = "block";
        tab.style.opacity = "1";
        tab.style.marginBottom = (parseInt(tab.style.marginBottom) || 0) + cssOptions.MARGIN_INFERIOR_TABS + "px";
        tab.style.paddingBottom = (parseInt(tab.style.paddingBottom) || 0) + cssOptions.PADDING_INFERIOR_TABS + "px";
        if (index < array.length - 1) {
          tab.style.borderBottom = cssOptions.VORA_INFERIOR_TABS;
        }
      });
    });
  }


  function FindByStyleAttr(htmlElement, attribute) {
    var All = htmlElement.getElementsByTagName("*");
    const foundElements = [];
    for (var i = 0; i < All.length; i++) {
      if (All[i].style[attribute] && All[i].style[attribute] !== "") {
        foundElements.push(All[i]);
      }
    }
    return foundElements;
  }

  function increaseElementsFontSize(elements, amount) {
    elements.forEach(function(element) {
      const OGFontSize = element.style.fontSize;
      if (OGFontSize.includes("px")) {
        const OGNumber = OGFontSize.replace(/\D/g, "");
        const newNumber = parseInt(parseInt(OGNumber) + amount) + "px";
        element.style.fontSize = newNumber;
      }
    });
  }



  function removeNBSP(htmlElement) {
    const ps = htmlElement.querySelectorAll("p");
    ps.forEach( function(el) {
        el.innerHTML = el.innerHTML.replace(/&nbsp;/g, " ");
      });
  }

  function eliminateBookExtraDetails(htmlElement) {
    const bookDetailsTable = htmlElement.querySelector(".book_info");
    let tableDetails;
    if (bookDetailsTable) { 
      tableDetails = bookDetailsTable.querySelector("table");
      bookDetailsTable.classList.add("mb-4");
      }
    if (tableDetails) {
      // Elimina les dues ultimes files de la taula amb detalls del llibre
      // Els apartats Imprès per i data
      tableDetails.deleteRow(-1);
      tableDetails.deleteRow(-1);
    }
  }

  const createBootstrapLink = () => {
    const bootstrapLink = document.createElement('link');
    bootstrapLink.rel = 'stylesheet';
    bootstrapLink.href = BOOTSTRAP_HREF;
    return bootstrapLink;
  }


export default editHTML;