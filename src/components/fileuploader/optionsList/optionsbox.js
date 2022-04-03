import React, {useState, useRef} from "react";
import { NumericalInput, NumericalInputWSelect} from "./inputs/numericalInputs";
import Checkbox from "./inputs/checkboxes";
import RadioButtons from "./inputs/radioButtons";
import KeyValueAssign from "./inputs/keyValueAssign";
import { EDIT_VIDEOS_STATE_TEXT, resetUserOptions} from "./optionsState";
import { getANumber } from "./aux/inputUtils";

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
    const {userEdits, setUserEdits} = optionsProps;
    const {popoverAfter, setPopoverAfter} = optionsProps;
    const {popoverCenter, setPopoverCenter} = optionsProps;
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
            pt-3 px-3 border border-gray-400 rounded my-4 xl:w-7/12 md:5/6 w-11/12 sm:text-base text-xs mx-auto`}
            ref={accordionPanel}
            onClick={() => {handleToggleAccordion();}}>
                <span className="text-xl font-bold">Opcions</span>
                <div className="panel cursor-default mt-2" style={panelStyle} 
                onClick={(e) => {e.stopPropagation();}}>
                    <div className="flex mb-4 mt-2 w-full justify-center">
                        <NumericalInputWSelect text="Nova mida de la font del cos" inputValue={bodyFontSize} 
                            handleInputChange={(e) => {setBodyFontSize(getANumber(e.target.value, 
                                {isFloat: selectedFontType === "em", canBeNegative: true} ))}} 
                            optionsJSX={selectOptions}
                            selectValue={selectedFontType}
                            handleSelectChange={(e) => {setSelectedFontType(e.target.value)}} />
                        <NumericalInput text="Augmenta mida font elements fixats (px)" value={increaseFixedSize}
                            handleChange={(e) => {setIncreaseFixedSize(getANumber(e.target.value, 
                                {isFloat: false, canBeNegative: false} ))}} />
                    </div>
                    <div className="flex mb-2 w-full justify-around">
                        <div className="flex mb-4 px-2 flex-col">
                            <div className="flex mb-4 px-2">
                                <RadioButtons text={EDIT_VIDEOS_STATE_TEXT} 
                                setterFunction={setVideoImgsState} startingOptionPos={videoImgsState} />
                            </div>
                            <button className={`bg-sky-500 text-white active:bg-sky-600 md:font-bold md:uppercase 
                            text-xs px-3 py-1 rounded-full shadow hover:shadow-md outline-none focus:outline-none 
                            mr-1 mb-1 ease-linear transition-all duration-150`} 
                            onClick={() => {resetUserOptions(optionsProps);}} type="button">
                                Valors per defecte
                            </button>
                        </div>

                        <div className="flex flex-col mb-4">
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
                                    checked={addTitlePage && removeDetails} setChecked={setAddTitlePage} 
                                    options={{disabled: !removeDetails}} />
                            </div>
                            <div className="flex mb-2 px-2">
                                <Checkbox text={"Popovers centrats"} 
                                    checked={popoverCenter} setChecked={setPopoverCenter}
                                    />
                            </div>
                            <div className="flex mb-2 px-2">
                                <Checkbox text={"Popovers mostrats al final"} 
                                    checked={popoverAfter} setChecked={setPopoverAfter}
                                    />
                            </div>
                        </div>
                    </div>
                    <KeyValueAssign valueArray={userEdits} setValueArray={setUserEdits} />
                </div>
        </div>
    );
}

export default Optionsbox;