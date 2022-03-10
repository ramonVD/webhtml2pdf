import React, {useState, useRef} from "react";
import { NumericalInput, NumericalInputWSelect} from "./inputs/numericalInputs";
import Checkbox from "./inputs/checkboxes";
import RadioButtons from "./inputs/radioButtons";
import KeyValueAssign from "./inputs/keyValueAssign";
import { EDIT_VIDEOS_HTML_STATE } from "../config/optionsState";
import { backslashSpecialRegexChars } from "../../htmlUtils/editHTML/aux/utils";

/*Generates an accordion that contains an editable set of options that define what 
settings to apply when editing the html file*/
const Optionsbox = ({optionsProps}) => {
    const {bodyFontSize, setBodyFontSize} = optionsProps;
    const {selectedFontType, setSelectedFontType} = optionsProps;
    const {increaseFixedSize, setIncreaseFixedSize} = optionsProps;
    const {videoImgsState, setVideoImgsState} = optionsProps;
    const {removeDetails, setRemoveDetails} = optionsProps;
    const {removeIndex, setRemoveIndex} = optionsProps;
    const {addTitlePage, setAddTitlePage} = optionsProps;
    const {elementSizeArray, setElementSizeArray} = optionsProps;
    const {noNbsp, setNoNbsp} = optionsProps;

    const [open, setOpen] = useState(false);
    const handleToggleAccordion = () => setOpen(!open);
    const accordionPanel = useRef(null);

    const selectOptions = [<option value="em" key="em">em</option>, <option key="px" value="px">px</option>]

    const interiorHeight = (open) ? accordionPanel.current.nextElementSibling.scrollHeight : 0;
    const panelStyle = {maxHeight: interiorHeight, padding: "0 18px", 
    backgroundColor: "white", overflowX: "hidden", transition: "0.4s", zIndex:"20"}
    return (
        <div className={`bg-gray-100 text-center hover:bg-gray-200 text-gray-700 cursor-pointer pb-2 
        pt-3 px-3 border border-gray-400 rounded my-4 xl:w-1/2 md:5/6 w-11/12 sm:text-base text-xs mx-auto`}
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
                        <NumericalInput text="Augmenta mida font elements fixats (px)" value={increaseFixedSize}
                            handleChange={(e) => {setIncreaseFixedSize(getANumber(e.target.value))}} />
                    </div>
                    <div className="flex mb-4 w-full justify-around">
                        <div className="flex mb-4 px-2">
                            <RadioButtons text={EDIT_VIDEOS_HTML_STATE} 
                            setterFunction={setVideoImgsState} startingOptionPos={videoImgsState} />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex mb-2 px-2">
                                <Checkbox text={"Elimina espais en blanc extra"} 
                                    checked={noNbsp} setChecked={setNoNbsp} />
                            </div>
                            <div className="flex mb-2 px-2">
                                <Checkbox text={"Elimina pàgina de detalls (llibre IOC)"} 
                                    checked={removeDetails} setChecked={setRemoveDetails} />
                            </div>
                            <div className="flex mb-2 px-2">
                                <Checkbox text={"Elimina pàgina d'index (llibre IOC)"} 
                                    checked={removeIndex} setChecked={setRemoveIndex} />
                            </div>
                            <div className="flex mb-2 px-2">
                                <Checkbox text={"Afegeix pàgina títol (llibre IOC)"} 
                                    checked={addTitlePage && removeIndex && removeDetails} setChecked={setAddTitlePage} 
                                    options={{disabled: !removeDetails || !removeIndex}} />
                            </div>
                        </div>
                    </div>
                    <KeyValueAssign valueArray={elementSizeArray} setValueArray={setElementSizeArray} />
                </div>
        </div>
    );
}

/*Function to apply to a text after a new digit/letter/symbol has been added to that text.
It removes all* non-numbers from the text and returns it
 (*it also leaves a single period if there are any, or a
minus sign, but only if its in the first position as to denote negative numbers)*/
export const getANumber = (text) => {
    if (text === "-") { return text; }
    if (text.indexOf("-") !== -1 && text.indexOf("-",1) !== -1) {
        /*Can use this regex to force all subsequent appearances of -
        after the first to be removed, it will only not remove it
        if its in the first position (ideal for the negative sign)*/
        return text.replace(/(?!^)-/g, "");
    }
    let noLetters = text.replace(/[^0-9.-]/g, "");
    //NOTA: Aixo per evitar coses rares com 1.23141.2515.35235
    noLetters = removeMoreThanOneSymbol(noLetters, ".");
    const tryNumber = parseFloat(noLetters);
    if (!isNaN(tryNumber)) {
        return noLetters;
    }
    return "";
}

/*Removes more than one symbol in a string, just leaves the first one 
from left to right. Can be probably done more easily
with a replace and a custom function inside 
function removeMoreThanOneSymbol(text, symbol) {
    if (text.indexOf(symbol) !== -1) {
        const restOfString = text.substring(text.indexOf(symbol)+1);
        if (restOfString === "") { return text; }
        const useSymbol = backslashSpecialRegexChars(symbol);
        const regex = new RegExp(useSymbol,"g");
        const removeOtherPeriods = restOfString.replace(regex, "");
        return text.substring(0, text.indexOf(symbol)+1) + removeOtherPeriods;
    }
    return text;
}*/

/*Same as the above commented function, removes all but the first
symbol found in a string (from left to right).
Is this one faster? More elegant? Need to test probably*/
function removeMoreThanOneSymbol(text, symbol) {
    if (text.indexOf(symbol) !== -1) {
        const useSymbol = backslashSpecialRegexChars(symbol);
        const regex = new RegExp(`(${useSymbol})`,"g");
        let first = true;
        //Remove all but the first instance of a symbol
        return text.replace(regex, (match) => {
            if (first) { 
                first = false; 
                return match;
            }
            return ""

        });
    }
    return text;
}

export default Optionsbox;