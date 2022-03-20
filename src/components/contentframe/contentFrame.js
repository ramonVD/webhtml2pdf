import React, {useEffect, useRef } from "react";

/*Hidden iframe that loads the contents of an html element generated from 
the file that the user uploads, then prints its contents*/
const ContentFrame = (props) => {

const { iframeContent = "" } = props;
const { handleUploadChange = function() {} } = props;
const cfRef = useRef(0);
const errorState = props.errorState;
const ifID = "ifContentLoader";

  useEffect(() => {

    const printIFContents = (id) => {
      /*Need to do it this way, using id. Using a ref and iframe.current print
      doesnt work apparently? Cross browser compatibility taken from
      https://leerob.io/blog/how-to-print-in-react-using-iframes
      */
      const iframe = document.frames
        ? document.frames[id]
        : document.getElementById(id);
  
      const iframeWindow = iframe.contentWindow || iframe;
      if (iframe.srcdoc !== "") {
          iframe.focus();
          iframeWindow.print();
      }
  }


    const handleLoad = (event) => {
      if (event.target.srcdoc !== "") {
        printIFContents(ifID);
        const success = (cfRef.current.getAttribute("data-error") === "") ? "SUCCESS" : "PARTIAL_SUCCESS";
        handleUploadChange(success);
      }
    }

    document.getElementById(ifID).addEventListener('load', handleLoad);

    return () => {
      document.getElementById(ifID).removeEventListener('load', handleLoad);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

return (
    <iframe src="" className="hidden" ref={cfRef} data-error={errorState}
    title="Hidden Content Loader" name="HCl" id={ifID}
    srcDoc={iframeContent}></iframe>
)    
}

export default ContentFrame;