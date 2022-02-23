import React from "react";

export const NumericalInput = ({ text, value, handleChange, options }) => {
    if (options === undefined) { options = {}}
    const defaultInputClasses = "appearance-none text-center block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
    const  defaultDivClasses = "w-full md:w-1/6 px-3 mb-6 md:mb-0"
    const { divClasses = defaultDivClasses } = options;
    const { inputClasses = defaultInputClasses} = options;
    const NIName = "NI-" + text.substring(0,3);
    return (
        <div className={divClasses}>
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                 htmlFor={NIName}>
                {text}
                </label>
                <input name={NIName} className={inputClasses} type="text" value={value} onChange={handleChange}/>
        </div>
    );
}

export const NumericalInputWSelect = ({ text, inputValue, selectValue, optionsJSX, handleInputChange, handleSelectChange, options }) => {
    if (options === undefined) { options = {}}
    const defaultInputClasses = "appearance-none text-center block w-full bg-gray-200 text-gray-700 border border-gray-200 py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500";
    const defaultDivClasses = "w-full md:w-1/6 px-3 mb-6 md:mb-0";
    const defaultSelectClasses = "form-select mb-2 block w-full pl-2 py-3 text-l font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none";
    const { divClasses = defaultDivClasses } = options;
    const { inputClasses = defaultInputClasses} = options;
    const { selectClasses = defaultSelectClasses} = options;
    const NIName = "NIS-" + text.substring(0,3);
    return (
        <div className={divClasses}>
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" 
            htmlFor={NIName}>
            {text}
            </label>
            <div className="flex mb-4 h-12">
                <div className="w-3/4">
                    <input className={inputClasses} name={NIName}
            type="text" value={inputValue} onChange={handleInputChange}/>
                    </div>
                    <div className="">
                        <div className="mb-3">
                            <select className={selectClasses} onChange={handleSelectChange} value={selectValue}>
                                {optionsJSX}
                            </select>
                        </div>
                </div>
            </div>
        </div>
    );
}
