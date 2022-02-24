import React, {useState, useRef} from "react";
import { NumericalInput, NumericalInputWSelect} from "./inputs/numericalInputs";

const Optionsbox = ({optionsProps}) => {
    const {bodyFontSize, setBodyFontSize} = optionsProps;
    const {selectedFontType, setSelectedFontType} = optionsProps;
    const {increaseFixedSize, setIncreaseFixedSize} = optionsProps;
    const {videoLinkOnly, setVideoLinkOnly} = optionsProps;
    const {noNbsp, setNoNbsp} = optionsProps;

    const [open, setOpen] = useState(false);
    const handleToggleAccordion = () => setOpen(!open);
    const accordionPanel = useRef(null);

    const selectOptions = [<option value="em" key="em">em</option>, <option key="px" value="px">px</option>]

    const interiorHeight = (open) ? accordionPanel.current.nextElementSibling.scrollHeight : 0;
    const panelStyle = {maxHeight: interiorHeight, padding: "0 18px", backgroundColor: "white", overflow: "hidden", transition: "0.4s", zIndex:"20"}
    return (
        <div className="bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer pb-2 pt-3 px-3 border border-gray-400 rounded my-4 sm:w-1/2 w-full sm:text-base text-xs mx-auto"
            ref={accordionPanel}
            onClick={() => {handleToggleAccordion();}}>
                <span className="text-xl font-bold">Opcions</span>
                <div className="panel cursor-default mt-2" style={panelStyle} 
                onClick={(e) => {e.stopPropagation();}}>
                    <div className="flex mb-4 mt-2 w-full justify-center">
                        <NumericalInputWSelect text="Nova mida de la font del cos" inputValue={bodyFontSize} 
                            handleInputChange={(e) => {setBodyFontSize(getANumber(e.target.value))}} 
                            optionsJSX={selectOptions}
                            selectValue={selectedFontType}
                            handleSelectChange={(e) => {setSelectedFontType(e.target.value)}} />
                        <NumericalInput text="Augmenta mida font altres elements (px)" value={increaseFixedSize}
                            handleChange={(e) => {setIncreaseFixedSize(getANumber(e.target.value))}} />
                    </div>
                    <div className="flex mb-4 w-full justify-around">
                        <div className="flex mb-4 p-2">
                                <input className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" 
                                type="checkbox" checked={videoLinkOnly} id="flexCheckDefault2"
                                onChange={() => {setVideoLinkOnly(!videoLinkOnly)}} />
                                <label className="form-check-label inline-block text-gray-800" htmlFor="flexCheckChecked">
                                Canvia imatge dels vídeos pel seu enllaç
                                </label>
                        </div>
                        <div className="flex mb-4 p-2">
                                <input className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" 
                                type="checkbox" checked={noNbsp} id="flexCheckDefault2" 
                                onChange={() => {setNoNbsp(!noNbsp)}}/>
                                <label className="form-check-label inline-block text-gray-800" htmlFor="flexCheckChecked">
                                Elimina espais en blanc extra
                                </label>
                        </div>
                    </div>
                </div>
        </div>
    );
}

/*Function to apply to a text after a new digit/letter/symbol has been added to that text.
It removes all non-numbers* (it also leaves a single period if there are any)
from the text and returns it*/
const getANumber = (text) => {
    let noLetters = text.replace(/[^0-9.]/g, "");
    //NOTA: Aixo per evitar coses rares com 1.23141.2515.35235
    if (noLetters.indexOf(".") !== -1) {
        const restOfString = noLetters.substring(noLetters.indexOf(".")+1);
        const removeOtherPeriods = restOfString.replace(/\./g, "");
        noLetters = noLetters.substring(0, noLetters.indexOf(".")+1) + removeOtherPeriods;
    }
    const tryNumber = parseFloat(noLetters);
    if (!isNaN(tryNumber)) {
        return noLetters;
    }
    return "";
}

export default Optionsbox;