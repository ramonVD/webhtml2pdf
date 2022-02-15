import React, {useEffect} from "react";

/*CAL FER QUE QUAN HI HAGI UN CANVI A LA DATA ES RECARREGUI LA IFRAME
I SI ES POT IMPRIMIR QUE S'IMPRIMEIXI EL SEU CONTINGUT.
PER ARA FEM SERVIR POSTMESSAGE ETC PERO TRANKILAMENT POT FER-SE AMB STATE
(portar loaded desde props p.ex i si es cert tira milles...)*/
const ContentFrame = ({ props }) => {

const {iframeContent} = props || "";

const ifID = "ifContentLoader";

  useEffect(() => {

    const handleMessage = (event) => {
        if (event.data.action === 'print_iframe') {
            printIFContents(ifID);
        }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);


const printIFContents = (id) => {
    /*Need to do it this way, using id. Using a ref and iframe.current print
    doesnt work apparently? Cross browser compatibility taken from
    https://leerob.io/blog/how-to-print-in-react-using-iframes
    */
    const iframe = document.frames
      ? document.frames[id]
      : document.getElementById(id);

    console.log(iframe.srcdoc);
    const iframeWindow = iframe.contentWindow || iframe;
    if (iframe.srcdoc !== "") {
        iframe.focus();
        iframeWindow.print();
    }
}

return (
    <iframe src="" className="" 
    title="Hidden Content Loader" name="HCl" id={ifID}
    srcDoc={iframeContent}></iframe>
)    
}

export default ContentFrame;