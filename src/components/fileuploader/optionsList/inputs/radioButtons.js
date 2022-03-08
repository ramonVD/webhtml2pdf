/*Generate rows of vertical radioButtons from their text*/
export const RadioButtons = ({ text, startingOptionPos=0, setterFunction, options={} }) => {
    const wrapperDivDefaultClass = "flex flex-col items-start";
    const { wrapperDivClass = wrapperDivDefaultClass } = options;
    const optionsJSX = text.map( (text, index, options) => 
        createDefaultRadioJSX(text, index, startingOptionPos===index, setterFunction, options) );
    return (
        <div className={wrapperDivClass}>
            {optionsJSX}
        </div>
    );
}


const createDefaultRadioJSX = (text, pos, amIChecked, setterFunction, options={}) => {
    //Set classes via options here (WIP)
    const inputDefaultClass = "form-check-input appearance-none rounded-full h-4 w-4 border border-gray-300 bg-white checked:bg-orange-600 checked:border-orange-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer";
    const labelDefaultClass = "form-check-label inline-block text-gray-800 cursor-pointer mb-2";
    return(
        <div key={`flexRadio${text}${pos}`} className="align-start">
            <input className={inputDefaultClass}
            type="radio" name={`flexRadio${text}${pos}`} id={`flexRadio${text}${pos}`} checked={amIChecked}
            onChange={() => {setterFunction(pos)}}/>
            <label className={labelDefaultClass} htmlFor={`flexRadio${text}${pos}`}>
                {text}
            </label>
        </div>
    );
}

export default RadioButtons;