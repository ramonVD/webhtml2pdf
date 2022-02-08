/*Standard example*/
import React, { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["HTML", "ZIP", "RAR"];

const DragDrop = () => {
    const [file, setFile] = useState(null);
    const handleChange = (file) => {
      console.log(file);
      setFile(file);
    };

    return (
      <div className="text-center d-block">
        <FileUploader handleChange={handleChange}
        name="htmlFile" types={fileTypes} label={"Upload your HTML files"}/>
      </div>
    );
  }
  
  export default DragDrop;