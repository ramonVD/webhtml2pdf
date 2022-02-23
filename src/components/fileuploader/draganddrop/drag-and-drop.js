/*Adapted from:
 https://codesandbox.io/s/github/dineshselvantdm/drag-drop-file-upload-react-hooks?file=/utils/drag-drop.js*/
import React, { useState, useRef } from "react";
import { fileValidator, preventBrowserDefaults } from "./draganddroputils";
import ContentFrame from "../../contentframe/contentFrame";

const DragAndDrop = ({ processDrop, children, config, handleUploadChange }) => {
  let [dragOverlay, setDragOverlay] = useState(false);
  const [data, setData] = useState("");
  const [error, setError] = useState(false);
  let dragCounter = useRef(0);
  const clickInputRef = useRef(null);

  
  const handleDrag = e => {
    preventBrowserDefaults(e);
  };

  const handleDragIn = e => {
    preventBrowserDefaults(e);
    dragCounter.current++;
    if (e.dataTransfer.items.length > 0) {
      setDragOverlay(true);
    }
  };
  const handleDragOut = e => {
    preventBrowserDefaults(e);
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragOverlay(false);
    }
  };
  const handleDrop = e => {
    const files = e.dataTransfer.files;
    if (!files) { return; }
    preventBrowserDefaults(e);
    setDragOverlay(false);
    setError(false);
    dragCounter.current = 0;
    const { isValidFile, errVal } = fileValidator(files, config);
    if (!isValidFile) {
      if (errVal) {
        setError(errVal);
      }
      return false;
    }
      fileReader(files);
  };

  const handleSelectFile = (e)=> {
      const file = [e.target.files[0]];
      setError(false);
      fileReader(file);
  }

  const fileReader = files => {
    setData("");
    const reader = new FileReader();
    reader.readAsText(files[0]);
    reader.onload = loadEvt => {
      setData(processDrop(loadEvt.target.result).innerHTML);
    };
  };

  const dragOverlayClass = dragOverlay ? "border-red-800 bg-grey-500" : "";
  
  return (
    <div className="flex justify-center flex-col">
      {error && <p className="text-red-800">{error}</p>}
      <div
        className={`h-96 w-96 basis-full mb-5 py-24 ${dragOverlayClass}`}
        style={{border: "dashed rgb(206, 206, 206) 3px"}}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => {clickInputRef.current.click();}}
      >
        {children}
       
        <div className="button-wrapper">
          {data !== "" && 
          <button className="bg-green-800 text-black-800 p-4 z-50"
          onClick={(e) => {
            setData("");
            clickInputRef.current.value=null;
            handleUploadChange("INIT");
            e.preventDefault();
            e.stopPropagation();}}>
            Remove</button>
          }
        </div>
      </div>
      <div className="">
        <label htmlFor="fileAccept">O prem aquí -&nbsp;</label>
        <input type="file" name="fileAccept" 
          accept=".html" multiple={false} ref={clickInputRef}
          onChange={handleSelectFile} />
        <ContentFrame iframeContent={data} 
        handleUploadChange={handleUploadChange} /> 
      </div>
    </div>
  );
};

export default DragAndDrop;
