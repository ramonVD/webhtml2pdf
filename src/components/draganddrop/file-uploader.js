import React, { useState } from "react";
import DragAndDrop from "./drag-and-drop";
import { createDummyHTML, validateHTMLString } from "../parseHTMLFiles";
import editHTML from "../editHTML";

const config = {
  allowedFileFormats: ["text/html"],
  fileSizeMBLimit: 5,
  filesLimit: 1
};

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
  SUCCESS: <div className="pb-3">done, press here again to re-print</div>,
  FAILURE: <>fk</>
}

const FileUploader = () => {
  /*All this should go to a separate function in processHTML.js or w/e*/
  const [loaderState, setLoaderState] = useState(FILE_UPLOADER_STATE.INIT)
  const processDrop = HTMLString => {
    setLoaderState("PROCESSING");
    /*Validate that its a real html file*/
    const validHTML = validateHTMLString(HTMLString);
    if (validHTML === "") { return; }
    /*Stringify it, use it to create an html element*/
    const htmlElement = createDummyHTML(validHTML);
    /*Apply changes to the html element*/
    return editHTML(htmlElement);
    /* As of now, we send the edited html to an iframe and
    print it in the browser window.


    Doing it this way bc html 2 pdf converting 
    methods have proven not very reliable, 
    at least in javascript.
    In the past - Convert that html element to pdf
    const pdf = convertToPdf(editedHTML);
    Send pdf to user.*/
  };



  return (
        <DragAndDrop processDrop={processDrop} config={config}
        handleStateChange={setLoaderState}>
          {FILE_UPLOADER_STATE_JSX[loaderState]}
        </DragAndDrop>
  );
};

export default FileUploader;
