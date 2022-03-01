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
        <div className="bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer pb-2 pt-3 px-3 border border-gray-400 rounded my-4 xl:w-1/2 md:5/6 w-11/12 sm:text-base text-xs mx-auto"
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
                        <div className="flex mb-4 px-2">
                                <label class="inline-flex items-center mt-3">
                                    <input className="form-checkbox h-5 w-5 text-indigo-600 cursor-pointer transition-all delay-150"
                                    type="checkbox" checked={videoLinkOnly} id="videoLink" 
                                    onChange={() => {setVideoLinkOnly(!videoLinkOnly)}} />
                                    <span class="ml-2 text-gray-700">Canvia imatge dels vídeos pel seu enllaç</span>
                                </label>
                        </div>
                        <div className="flex mb-4 px-2">
                                <label class="inline-flex items-center mt-3">
                                    <input className="form-checkbox h-5 w-5 text-indigo-600 cursor-pointer transition-all delay-150"
                                    type="checkbox" checked={noNbsp} id="noNbsp" 
                                    onChange={() => {setNoNbsp(!noNbsp)}} />
                                    <span class="ml-2 text-gray-700">Elimina espais en blanc extra</span>
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