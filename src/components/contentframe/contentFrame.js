import React, {useEffect} from "react";

/*LOADS THE CONTENT OF AN EXTERNAL HTML PAGE (this isnt very secure)
AND PRINTS ITS CONTENTS AFTER LOADING IT.*/
const ContentFrame = (props) => {

const {iframeContent} = props || "";
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
      }
    }

    document.getElementById(ifID).addEventListener('load', handleLoad);

    return () => {
      document.getElementById(ifID).removeEventListener('load', handleLoad);
    };
  }, []);


return (
    <iframe src="" className=""
    title="Hidden Content Loader" name="HCl" id={ifID}
    srcDoc={iframeContent}></iframe>
)    
}

export default ContentFrame;