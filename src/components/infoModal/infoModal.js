import React, {useState, useEffect, useRef} from "react";
import styles from "./infoModal.module.css"

const InfoModal = ({buttonText, children}) => {

    const [open, setOpen] = useState(false);
    const modalRef = useRef(null);

    const handleToggleModal = () => {setOpen(!open);}

    useEffect ( () => {
        const handleWindowClick = function(event) {
            if (event.target === modalRef.current) {
                handleToggleModal();
            }
          } 
          
          window.addEventListener("click", handleWindowClick);

        return () => {
            window.removeEventListener("click", handleWindowClick);
        }
    })

    const hideModalClasses = open ? "" : " hidden ";
    //Passar els styles a classes de tailwinds
    return (
        <div>
            <button className="bg-sky-100 hover:bg-sky-200 sm:text-3xl text-xl font-bold sm:px-5 px-4 py-1 sm:border-2 border border-sky-400 rounded"
            onClick={() => {handleToggleModal();}} >
            {buttonText}
            </button>
            <div id="myModal" className={hideModalClasses + styles.appearModal} ref={modalRef}
            style={{
                position: "fixed", zIndex: "100",left: "0", top: "0", width: "100%",
                height: "100%", overflow: "auto", backgroundColor: "rgb(0,0,0)",
                // eslint-disable-next-line no-dupe-keys
                backgroundColor: "rgba(0,0,0,0.4)"
              }}>
                <div className="modal-content text-left p-5 md:w-3/4 w-11/12"
                style= {{  backgroundColor: "#fefefe", margin: "7% auto", border: "1px solid #888"}}>
                    <span className="close cursor-pointer relative float-right" style={{position:"relative",float:"right",color: "#aaa",right: "right", top:"-25px", fontSize: "28px", fontWeight: "bold"}}
                    onClick={() => {handleToggleModal();}}>&times;</span>
                    {children}
                </div>

            </div>
        </div>

    );
}


export default InfoModal