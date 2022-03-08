/*File uploader with drag and drop adapted from:
 https://codesandbox.io/s/github/dineshselvantdm/drag-drop-file-upload-react-hooks?file=/utils/drag-drop.js*/
import React, { useState} from "react";
import DragAndDrop from "./draganddrop/drag-and-drop";
import { createCleanHTMLElement, NonEmptyHTMLString } from "../htmlUtils/parseHTMLFiles";
import editHTML from "../htmlUtils/editMainHTML";
import Optionsbox from "./optionsList/optionsbox";
import { FILE_UPLOADER_STATE, FILE_UPLOADER_STATE_JSX, 
  UPLOADED_FILE_SETTINGS } from "./config/fileuploaderState";
import { defaultHTMLEditOptions } from "./config/optionsState";

/*Main element of the app.
Consists of an options accordion with the possible options applied when editing the html,
and a drag & drop box + button to upload the desired file that will be edited then
saved as pdf by the user.
Technically, the file's contents will be cleaned and edited first, then drawn on the page
and displayed for the user to be printed as a pdf.*/


const FileUploader = () => {
  /*Isnt there a better way... than send all these as props?*/
  const [bodyFontSize, setBodyFontSize] = useState(defaultHTMLEditOptions.MIDA_FONT);
  const [selectedFontType, setSelectedFontType] = useState(defaultHTMLEditOptions.MIDA_FONT_UNITS);
  const [increaseFixedSize, setIncreaseFixedSize] = useState(defaultHTMLEditOptions.AUGMENTAR_MIDA_FONT_PX);
  const [videoImgsState, setVideoImgsState] = useState(0);
  const [removeDetails, setRemoveDetails] = useState(false);
  const [removeIndex, setRemoveIndex] = useState(false);
  const [addTitlePage, setAddTitlePage] = useState(false);
  const [noNbsp, setNoNbsp] = useState(defaultHTMLEditOptions.NO_NBSP);

  const currentOptions = {
    bodyFontSize: bodyFontSize, 
    selectedFontType: selectedFontType,
    increaseFixedSize:increaseFixedSize, 
    videoImgsState: videoImgsState,
    removeDetails: removeDetails,
    removeIndex: removeIndex,
    addTitlePage: addTitlePage,
    noNbsp:noNbsp
  }

  const optionsSetters = {
    setBodyFontSize: setBodyFontSize,
    setSelectedFontType: setSelectedFontType,
    setIncreaseFixedSize: setIncreaseFixedSize,
    setVideoImgsState: setVideoImgsState,
    setRemoveDetails: setRemoveDetails,
    setRemoveIndex: setRemoveIndex,
    setAddTitlePage: setAddTitlePage,
    setNoNbsp: setNoNbsp
  }

  const [loaderState, setLoaderState] = useState(FILE_UPLOADER_STATE.INIT);

  const processDrop = async HTMLString => {
    setLoaderState(FILE_UPLOADER_STATE.PROCESSING);
    /*Validate that its a real html file*/
    const nonEmptyHTML = NonEmptyHTMLString(HTMLString);
    if (nonEmptyHTML === "") { return; }
    /*Stringify it, use it to create an html element*/
    const cleanHtmlElement = createCleanHTMLElement(nonEmptyHTML);
    /*Apply changes to the html element*/
    return await editHTML(cleanHtmlElement, currentOptions);
    /* As of now, we send the edited html to an iframe and
    print it in the browser window. Before, we used a library
    to convert html to pdf but they have proven to be spotty.*/
  };

  return (
    <div>
      <Optionsbox optionsProps={{...currentOptions, ...optionsSetters}} />
      <div className="flex">
        <DragAndDrop processDrop={processDrop} config={UPLOADED_FILE_SETTINGS}
                      handleUploadChange={setLoaderState}>
          {FILE_UPLOADER_STATE_JSX[loaderState]}
        </DragAndDrop>
      </div>
    </div>
  );
};

export default FileUploader;
