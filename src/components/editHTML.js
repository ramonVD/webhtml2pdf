/*
Changes to apply to an html document before the choice to print it as a pdf
document is displayed.
*/

export function editHTML(document, options) {

    /*Per defecte aplica padding i margin i assigna un color a la vora inferior 
      de cada tab-pane (excepte l'últim) dins un element amb "pestanyes". Canviar aquí.*/
    const openedTabsCSS = {
      PADDING_INFERIOR_TABS: 10,
      MARGIN_INFERIOR_TABS: 15,
      VORA_INFERIOR_TABS: "2px solid black"
    }
    //Canviar la nova mida de la font a conveniencia
    const MIDA_FONT = options.bodyFontSize + options.selectedFontType;
    //Augmenta la mida de lletra amb mida fixa, p.ex 16px -> 20px
    const AUGMENTAR_MIDA_FONT_PX = options.increaseFixedSize;

    //Increase body font size
    document.getElementsByTagName("body")[0].style.fontSize = MIDA_FONT;

    openAllCollapsablesAndTabs(document, openedTabsCSS);

    //Increase font size of elements with a defined font-size in px too.
    increaseElementsFontSize(FindByStyleAttr(document, "fontSize"), AUGMENTAR_MIDA_FONT_PX);

    if (options.videoLinkOnly) {
      replaceVideosWithLink(document);
    }
     
    if (options.noNbsp) {
      removeNBSP(document);
    }

    eliminateBookExtraDetails(document);

    return document;
  }


  function openAllCollapsablesAndTabs(document, cssOptions) {
    var collapsables = document.querySelectorAll(".collapse");
    collapsables.forEach(function(collapsable) {
      collapsable.style.display = "block";
    });
    var tabsContainers = document.querySelectorAll(".tab-content");
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


  function FindByStyleAttr(document, attribute) {
    var All = document.getElementsByTagName("*");
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

  function replaceVideosWithLink(document) {
    var iframes = document.querySelectorAll("iframe, .video-js");
    const arrayIframes = Array.from(iframes);
    const videoSrcs = arrayIframes.map(function(el) {
      if (el.tagName.toLowerCase() === "iframe") {
        return el.src;
      } else if (el.tagName.toLowerCase() === "video") {
        const videoAttrStr = el.getAttribute("data-setup-lazy");
        if (videoAttrStr !== undefined) {
          const videoAttr = JSON.parse(videoAttrStr);
          return videoAttr["sources"][0]["src"];
        }
      }
    });
    let newElement;
    for (let i = 0; i < arrayIframes.length; i++) {
      newElement = createVideoReplacement(videoSrcs[i]);
      iframes[i].parentNode.replaceChild(newElement, iframes[i])
    }
  }

  function createVideoReplacement(src) {
    const newDiv = document.createElement('div');
    newDiv.classList.add("py-5");
    // style div
    const p = document.createElement("p");
    p.innerHTML = "Vídeo:&nbsp;&nbsp;&nbsp;";
    const newLink = document.createElement('a');
    newLink.innerText = src;
    newLink.href = src;
    p.appendChild(newLink);
    newDiv.appendChild(p);
    return newDiv;
  }

  function removeNBSP(document) {
    const ps = document.querySelectorAll("p");
    ps.forEach( function(el) {
        el.innerHTML = el.innerHTML.replace(/&nbsp;/g, " ");
      });
  }

  function eliminateBookExtraDetails(document) {
    const bookDetailsTable = document.querySelector(".book_info");
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

export default editHTML;