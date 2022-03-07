/*File uploader with drag and drop adapted from:
 https://codesandbox.io/s/github/dineshselvantdm/drag-drop-file-upload-react-hooks?file=/utils/drag-drop.js*/
import React, { useState} from "react";
import DragAndDrop from "./draganddrop/drag-and-drop";
import { createCleanHTMLElement, NonEmptyHTMLString } from "../htmlUtils/parseHTMLFiles";
import editHTML from "../htmlUtils/mainEditHTML";
import Optionsbox from "./optionsList/optionsbox"

/*Main element of the app.
Consists of an options accordion with the possible options applied when editing the html,
and a drag & drop box + button to upload the desired file that will be edited then
saved as pdf by the user.
Technically, the file's contents will be cleaned and edited first, then drawn on the page
and displayed for the user to be printed as a pdf.*/

const config = {
  allowedFileFormats: ["text/html"],
  fileSizeMBLimit: 5,
  filesLimit: 1
};

/*DEFAULTS:*/
const defaultHTMLEditOptions = {
  MIDA_FONT: "1.4",
  MIDA_FONT_UNITS: "em",
  AUGMENTAR_MIDA_FONT_PX: 8,
  PADDING_INFERIOR_TABS: 10,
  MARGIN_INFERIOR_TABS: 15,
  VORA_INFERIOR_TABS: "2px solid black",
  VIDEO_LINK_ONLY: true,
  NO_NBSP: true
}

const FILE_UPLOADER_STATE = {
  INIT: "INIT",
  PROCESSING: "PROCESSING",
  SUCCESS: "SUCCESS",
  FAILURE: "FAILURE"
};

const FILE_UPLOADER_STATE_JSX = {
  INIT: <>
          <div className="md:text-lg py-2">
            Arrossega un arxiu html dins aquesta capsa
          </div>
          <div className="md:text-lg">O clica-la</div>
        </>,
  PROCESSING: <div className="mb-4">
                Editant l'arxiu i preparant-lo per passar a pdf...
              </div>,
  SUCCESS: <>
            <div className="md:text-2xl py-3 text-green-500 font-bold">Fet</div>
            <div className="md:text-lg mb-4">prem un altre cop per buscar un altre arxiu</div>
          </>,
  FAILURE: <>Hi ha hagut algun error carregant l'arxiu</>
}

const FileUploader = () => {
  /*Isnt there a better way... than send all these as props?*/
  const [bodyFontSize, setBodyFontSize] = useState(defaultHTMLEditOptions.MIDA_FONT);
  const [selectedFontType, setSelectedFontType] = useState(defaultHTMLEditOptions.MIDA_FONT_UNITS);
  const [increaseFixedSize, setIncreaseFixedSize] = useState(defaultHTMLEditOptions.AUGMENTAR_MIDA_FONT_PX);
  const [videoLinkOnly, setVideoLinkOnly] = useState(defaultHTMLEditOptions.VIDEO_LINK_ONLY);
  const [noNbsp, setNoNbsp] = useState(defaultHTMLEditOptions.NO_NBSP);

  const currentOptions = {
    bodyFontSize: bodyFontSize, 
    selectedFontType: selectedFontType,
    increaseFixedSize:increaseFixedSize, 
    videoLinkOnly: videoLinkOnly, 
    noNbsp:noNbsp
  }

  const optionsSetters = {
    setBodyFontSize: setBodyFontSize,
    setSelectedFontType: setSelectedFontType,
    setIncreaseFixedSize: setIncreaseFixedSize,
    setVideoLinkOnly:setVideoLinkOnly,
    setNoNbsp: setNoNbsp
  }

  const [loaderState, setLoaderState] = useState(FILE_UPLOADER_STATE.INIT);

  const processDrop = HTMLString => {
    setLoaderState(FILE_UPLOADER_STATE.PROCESSING);
    /*Validate that its a real html file*/
    const nonEmptyHTML = NonEmptyHTMLString(HTMLString);
    if (nonEmptyHTML === "") { return; }
    /*Stringify it, use it to create an html element*/
    const cleanHtmlElement = createCleanHTMLElement(nonEmptyHTML);
    /*Apply changes to the html element*/
    return editHTML(cleanHtmlElement, currentOptions);
    /* As of now, we send the edited html to an iframe and
    print it in the browser window. Before, we used a library
    to convert html to pdf but they have proven to be spotty.*/
  };

  return (
    <div>
      <Optionsbox optionsProps={{...currentOptions, ...optionsSetters}} />
      <div className="flex">
        <DragAndDrop processDrop={processDrop} config={config}
                      handleUploadChange={setLoaderState}>
          {FILE_UPLOADER_STATE_JSX[loaderState]}
        </DragAndDrop>
      </div>
    </div>
  );
};

export default FileUploader;
