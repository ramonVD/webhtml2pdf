import React, { useState, useRef } from "react";
import { fileValidator, preventBrowserDefaults } from "./draganddroputils";
import ContentFrame from "../../contentframe/contentFrame";

/*Drag & drop box with associated events, also adapted (check fileuploader)*/
const DragAndDrop = ({ processDrop, children, config, handleUploadChange }) => {
  let [dragOverlay, setDragOverlay] = useState(false);
  const [data, setData] = useState("");
  const [error, setError] = useState("");
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
    setError("");
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
      setError("");
      fileReader(file);
  }

  const fileReader = files => {
    setData("");
    const reader = new FileReader();
    reader.readAsText(files[0]);
    reader.onload = async loadEvt => {
      const finalHTML = await processDrop(loadEvt.target.result);
      if (finalHTML["errorsData"] !== "") {
          setError(finalHTML["errorsData"]);
      }
      setData(finalHTML["html"].innerHTML);
    }
  };

  let dragOverlayClass = dragOverlay ? "border-blue-800 text-slate-400" : 
        "border-gray-300 text-slate-500";
  if (error !== "") { dragOverlay = "border-red-800 text-red-400"; }
  return (
    <div className="mx-auto w-full text-center">
      {error !== "" && <p className={`text-red-800 md:mt-5 mt-3
       md:font-bold md:text-lg text-baseline`}>{error}</p>}
      <div
        className={`h-full xl:w-7/12 md:5/6 w-11/12 my-5 py-12 mx-auto  ${dragOverlayClass}`}
        style={{borderWidth: "3px", borderStyle: "dashed"}}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => {clickInputRef.current.click();}}
      >
        {children}
       
        <div className="button-wrapper">
          {data !== "" && 
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={(e) => {
            setData("");
            setError("");
            clickInputRef.current.value = null;
            handleUploadChange("INIT");
            e.preventDefault();
            e.stopPropagation();}}>
            Elimina l'arxiu</button>
          }
        </div>
      </div>
      <div className="text-center">
        <label htmlFor="fileAccept" className="mb-5 text-center">
          També pots prémer aquí -&nbsp;
        </label>
        <input type="file" name="fileAccept" 
          accept=".html" multiple={false} ref={clickInputRef}
          onChange={handleSelectFile} className="mb-5"/>
          
        <ContentFrame iframeContent={data} 
        handleUploadChange={handleUploadChange} errorState={error} /> 
      </div>
      <div className="text-sm text-slate-300 mt-5 text-center">
        Made by Ramon Vicente, 2022
      </div>
    </div>
  );
};

export default DragAndDrop;
