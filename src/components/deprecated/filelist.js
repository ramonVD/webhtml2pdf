
/* Adapted from
https://medium.com/@650egor/simple-drag-and-drop-file-upload-in-react-2cb409d88929
Converted it to use hooks. */

/*CHANGE: ONLY ONE (HTML) FILE ALLOWED 

WHY? THIS WILL GO INSIDE IOC'S CORPORATIVE PAGE SO NO NEED TO HANDLE RELATIVE IMPORTS,
ALL IMPORTS WILL BE ABSOLUTE AND IN THE FORMAT HTTP://www.ioc.campus... SO THEY ALL
SHOULD WORK SINCE THIS WEB WILL BE USED WHEN YOU ARE LOGGED INTO THE CAMPUS (Check
  for cookies maybe? OR JUST ERROR MSG ALERTING OF THIS)

  SO, IN THE END, GET AN HTML, MODIFY IT AND PASS IT TO PDF.*/
import DragAndDrop from "./draganddrop";
import { useState, useRef, useEffect } from "react";


const FileList = () => {
    const [files, setFiles] = useState({});
    const FLref = useRef(null);
    const _getFiles = () => FLref.current.files;
    const _setFiles = (value) => { FLref.current.files = value; return value;};
  
    useEffect ( () => {
      _setFiles({});
    },[]);
  
    const handleDrop = (draggedFiles) => {
      let fileList = {..._getFiles()};
      console.log(fileList);
      for (let i = 0; i < draggedFiles.length; i++) {
        if (!draggedFiles[i].name) return
        fileList[draggedFiles[i].name] = draggedFiles[i];
      }
      setFiles(_setFiles({...fileList}));
      console.log(fileList);
    }
  
    const clickRemoveFile = (filename) => {
      let fileL = {..._getFiles()}
      if (filename in fileL) {
        delete fileL[filename];
      }
      setFiles(_setFiles(fileL));
      /*Remove file from state if it exists and its clicked (maybe alert first?)*/
    }

    const readFiles = function () {
        Object.keys(files).forEach((filename) => {
          const reader = new FileReader();
    
          reader.onabort = () => console.log('file reading was aborted')
          reader.onerror = () => console.log('file reading has failed')
          reader.onload = () => {
          // Do whatever you want with the file contents
            const binaryStr = reader.result
            console.log(binaryStr)
          }
          reader.readAsText(files[filename]);
        });
    }

    return (
        <DragAndDrop handleDrop={handleDrop} handleStart={() => readFiles()}>
          <div style={{height: 300, width: 250}}  ref={FLref}>
            {Object.keys(files).map((filename, index) => fileLi(filename, index, clickRemoveFile))}
          </div>
        </DragAndDrop>
      )
  }

  /*Subclass of the DOM element for every file inside the filelist. Handles
  its styling and events*/
  const fileLi = (fileName, pos, handleClick) => {
    return <div key={"f" + pos} className="cursor-pointer z-50 relative py-1"
            onClick={() => {handleClick(fileName)}}>
            {fileName}
            </div>
  }

  export default FileList;