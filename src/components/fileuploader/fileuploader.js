import React, { useState} from "react";
import DragAndDrop from "./draganddrop/drag-and-drop";
import { createCleanHTMLElement, NonEmptyHTMLString } from "../parseHTMLFiles";
import editHTML from "../editHTML";
import Optionsbox from "./optionsList/optionsbox"

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
        <div>Drag and drop files here</div>
        <div>State machine based on file upload</div>
        </>,
  PROCESSING: <>on it</>,
  SUCCESS: <div className="pb-3">done, press here again to print another one</div>,
  FAILURE: <>fk</>
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
    setLoaderState("PROCESSING");
    /*Validate that its a real html file*/
    const nonEmptyHTML = NonEmptyHTMLString(HTMLString);
    if (nonEmptyHTML === "") { return; }
    /*Stringify it, use it to create an html element*/
    const cleanHtmlElement = createCleanHTMLElement(nonEmptyHTML);
    /*Apply changes to the html element*/
    return editHTML(cleanHtmlElement, currentOptions);
    /* As of now, we send the edited html to an iframe and
    print it in the browser window.


    Doing it this way because html to pdf converting 
    methods have proven to be not very reliable, 
    at least in javascript.
    In the past we did - 
    Convert that html element to pdf
    const pdf = convertToPdf(editedHTML);
    Send pdf to user.*/
  };

  return (
    <div>
        <Optionsbox optionsProps={{...currentOptions, ...optionsSetters}} />
      <div className="flex flex-col flex-wrap items-center justify-center py-3">
        <DragAndDrop processDrop={processDrop} config={config}
                      handleUploadChange={setLoaderState}>
          {FILE_UPLOADER_STATE_JSX[loaderState]}
        </DragAndDrop>
      </div>
    </div>
  );
};

export default FileUploader;
