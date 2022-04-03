/*File uploader with drag and drop adapted from:
 https://codesandbox.io/s/github/dineshselvantdm/drag-drop-file-upload-react-hooks?file=/utils/drag-drop.js*/
import React, { useState } from "react";
import DragAndDrop from "./draganddrop/drag-and-drop";
import { createCleanHTMLElement, isValidNonEmptyString } from "../htmlEdition/parseHTMLFiles";
import editHTML from "../htmlEdition/mainHTMLEdition";
import Optionsbox from "./optionsList/optionsbox";
import { FILE_UPLOADER_STATE, FILE_UPLOADER_STATE_JSX, 
  UPLOADED_FILE_SETTINGS } from "./fileuploaderState";
import { getUserOptionsState, copyUserEdits } from "./optionsList/optionsState";
import { setStateAndSaveInStorage } from "../localStorage/sessionHandling";

/*Main element of the app.
Consists of an options accordion with the possible options applied when editing the html,
and a drag & drop box + button to upload the desired file that will be edited then
saved as pdf by the user.
Localstorage is checked first when loading the userOptionsState, and from
then on just check state and save its changes to localstorage.
Technically, the file's contents will be cleaned and edited first, then drawn on the page
and displayed for the user to be printed as a pdf.*/

const FileUploader = () => {
  /*Isnt there a better way... than generating so many hooks...?
  Sometimes I miss getState();*/

  const options = getUserOptionsState();

  /*Upper component state*/
  const [bodyFontSize, setBodyFontSize] = useState(options.bodyFontSize);
  const [selectedFontType, setSelectedFontType] = useState(options.selectedFontType);
  const [increaseFixedSize, setIncreaseFixedSize] = useState(options.increaseFixedSize);
  const [videoImgsState, setVideoImgsState] = useState(options.videoImgsState);
  const [removeDetails, setRemoveDetails] = useState(options.removeDetails);
  const [removeIndex, setRemoveIndex] = useState(options.removeIndex);
  const [addTitlePage, setAddTitlePage] = useState(options.addTitlePage);
  const [userEdits, setUserEdits] = useState(copyUserEdits(options.userEdits));
  const [popoverAfter, setPopoverAfter] = useState(copyUserEdits(options.userEdits));
  const [popoverCenter, setPopoverCenter] = useState(copyUserEdits(options.userEdits));
  const [noNbsp, setNoNbsp] = useState(options.noNbsp);

  const optionsValues = {
    bodyFontSize: bodyFontSize, 
    selectedFontType: selectedFontType,
    increaseFixedSize:increaseFixedSize, 
    videoImgsState: videoImgsState,
    removeDetails: removeDetails,
    removeIndex: removeIndex,
    addTitlePage: addTitlePage,
    userEdits: userEdits,
    popoverAfter: popoverAfter,
    popoverCenter: popoverCenter,
    noNbsp: noNbsp
  }

  const optionsSetters = {
    setBodyFontSize: (value) => { setStateAndSaveInStorage(value, setBodyFontSize, "bodyFontSize"); },
    setSelectedFontType: (value) => { setStateAndSaveInStorage(value, setSelectedFontType, "selectedFontType"); },
    setIncreaseFixedSize: (value) => { setStateAndSaveInStorage(value, setIncreaseFixedSize, "increaseFixedSize"); },
    setVideoImgsState: (value) => { setStateAndSaveInStorage(value, setVideoImgsState, "videoImgsState"); },
    setRemoveDetails: (value) => { setStateAndSaveInStorage(value, setRemoveDetails, "removeDetails"); },
    setRemoveIndex: (value) => { setStateAndSaveInStorage(value, setRemoveIndex, "removeIndex"); },
    setAddTitlePage: (value) => { setStateAndSaveInStorage(value, setAddTitlePage, "addTitlePage"); },
    setUserEdits: (value) => { setStateAndSaveInStorage(value, setUserEdits, "userEdits"); },
    setNoNbsp: (value) => { setStateAndSaveInStorage(value, setNoNbsp, "noNbsp"); },
    setPopoverAfter: (value) => { setStateAndSaveInStorage(value, setPopoverAfter, "popoverAfter"); },
    setPopoverCenter: (value) => { setStateAndSaveInStorage(value, setPopoverCenter, "popoverCenter"); },
  }

  const [loaderState, setLoaderState] = useState(FILE_UPLOADER_STATE.INIT);
  
  const processDrop = async HTMLString => {
    setLoaderState(FILE_UPLOADER_STATE.PROCESSING);
    /*Validate that its a non empty, not undefined string*/
    const nonEmptyHTML = (isValidNonEmptyString(HTMLString)) ? HTMLString : "";
    if (nonEmptyHTML === "") { return; }
    /*Use it to create an html element*/
    const cleanHtmlElement = createCleanHTMLElement(nonEmptyHTML);
    /*Apply changes to the html element*/
    return await editHTML(cleanHtmlElement, optionsValues);
    
    /* As of now, we send the edited html to an iframe and
    print it in the browser window. Before, we used a library
    to convert html to pdf but they have proven to be spotty.*/
  };

  return (
    <div>
      <Optionsbox optionsProps={{...optionsValues, ...optionsSetters}} />
      <div className="flex">
        <DragAndDrop processDrop={processDrop} config={UPLOADED_FILE_SETTINGS}
                      handleUploadChange={setLoaderState} >
          {FILE_UPLOADER_STATE_JSX[loaderState]}
        </DragAndDrop>
      </div>
    </div>
  );
};

export default FileUploader;
