import React, { useState } from "react";
/*Options for parsing the html elements, only structure so far*/

/*DEFAULTS:*/
const defaultOptions = {
    MIDA_FONT: "1.4",
    MIDA_FONT_UNITS: "em",
    AUGMENTAR_MIDA_FONT_PX: 8,
    PADDING_INFERIOR_TABS: 10,
    MARGIN_INFERIOR_TABS: 15,
    VORA_INFERIOR_TABS: "2px solid black"
}

const Optionsbox = () => {
    const [bodyFontSize, setBodyFontSize] = useState(defaultOptions.MIDA_FONT);

    return (
        <div className="">
        <div className="flex mb-4 w-full justify-center">
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" 
                htmlFor="grid-zip">
                Nova mida de la font del cos:
                </label>
                <div className="flex mb-4 h-12">
                    <div className="w-3/4">
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                type="text" value={bodyFontSize} placeholder="1.2" readOnly/>
                        </div>
                        <div className="">
                            <div className="mb-3">
                                <select className="form-select mb-2
                                block
                                w-full
                                pl-2
                                py-3
                                text-l
                                font-normal
                                text-gray-700
                                bg-white bg-clip-padding bg-no-repeat
                                border border-solid border-gray-300
                                transition
                                ease-in-out
                                m-0
                                focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" 
                                aria-label=".form-select-lg example">
                                    <option value="em" defaultValue>em</option>
                                    <option value="px">px</option>
                                </select>
                            </div>
                    </div>
                </div>
            </div>
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                 htmlFor="grid-zip">
                Augmenta mida d'elements amb mida fixada (px)
                </label>
                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-zip" type="text" value={defaultOptions.AUGMENTAR_MIDA_FONT_PX} readOnly/>
            </div>
        </div>
        <div className="flex mb-4 w-full justify-center">
            <div className="flex mb-4 p-2">
                    <input className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="checkbox" value="" id="flexCheckDefault2"  />
                    <label className="form-check-label inline-block text-gray-800" htmlFor="flexCheckChecked">
                    Canvia imatge dels vídeos pel seu enllaç
                    </label>
            </div>
            <div className="flex mb-4 p-2">
                    <input className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer" type="checkbox" value="" id="flexCheckDefault2"  />
                    <label className="form-check-label inline-block text-gray-800" htmlFor="flexCheckChecked">
                    Elimina espais en blanc extra
                    </label>
            </div>
        </div>
    </div>
    );
}

export default Optionsbox;