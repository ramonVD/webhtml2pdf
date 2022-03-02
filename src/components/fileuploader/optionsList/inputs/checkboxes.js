
/*React components that define checkboxes to toggle a value*/

/*Standard checkbox to toggle a value true or false (not necessarily since
    the function to set the value is also passed but that's the normal use)*/
const Checkbox = ({text, checked, setChecked, options}) => {
    if (options === undefined) { options = {};}

    const defaultToggleClasses = "form-checkbox h-5 w-5 text-blue-600 cursor-pointer";
    const defaultToggleTextClasses = "ml-2 text-gray-700";

    const { toggleClasses = defaultToggleClasses } = options;
    const { toggleTextClasses = defaultToggleTextClasses } = options;
    return (
    <label className="inline-flex items-center">
        <input className={toggleClasses}
            type="checkbox" checked={checked} id="videoLink" 
            onChange={() => {setChecked(!checked)}} />
        <span className={toggleTextClasses}>{text}</span>
    </label>
    );
}

export default Checkbox;