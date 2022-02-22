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

const FileUploader = () => {
  const [loaderState, setLoaderState] = useState(FILE_UPLOADER_STATE.INIT);
  /*All this should go to a separate function in processHTML.js or w/e*/
  const processDrop = HTMLString => {
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
    <>
      {loaderState === FILE_UPLOADER_STATE.INIT && (
        <DragAndDrop processDrop={processDrop} config={config}>
          <div>Drag and drop files here</div>
          <div>State machine based on file upload</div>
        </DragAndDrop>
      )}
      {loaderState === FILE_UPLOADER_STATE.PROCESSING && (
        <div className="h-96 w-96 d-inline-block" 
        style={{border: "dashed rgb(206, 206, 206) 3px"}}>Processing...</div>
      )}
      {loaderState === FILE_UPLOADER_STATE.SUCCESS && (
        <div className="h-96 w-96 d-inline-block" 
        style={{border: "dashed rgb(206, 206, 206) 3px"}}>File Upload done!</div>
      )}
      {loaderState === FILE_UPLOADER_STATE.FAILURE && (
        <div className="h-96 w-96 d-inline-block" 
        style={{border: "dashed rgb(206, 206, 206) 3px"}}>
          File Upload failed. Please try again!
        </div>
      )}
    </>
  );
};

export default FileUploader;
