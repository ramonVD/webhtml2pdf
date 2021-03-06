
/*React components that define checkboxes to toggle a value*/

/*Standard checkbox to toggle a value true or false (not necessarily since
    the function to set the value is also passed but that's the normal use)*/
const Checkbox = ({ text, checked, setChecked, options={} }) => {
    const { disabled = false} = options;
    let defaultToggleTextClasses = "ml-2";
    if (disabled) { 
        defaultToggleTextClasses += " text-gray-300"
    } else {
        defaultToggleTextClasses += " text-gray-700"
    }
    const defaultToggleClasses = "form-checkbox h-5 w-5 text-blue-600 cursor-pointer";
    const { toggleClasses = defaultToggleClasses } = options;
    let { toggleTextClasses = defaultToggleTextClasses } = options;
    return (
    <label className="inline-flex items-center">
        <input className={toggleClasses}
            type="checkbox" checked={checked} id="videoLink" 
            onChange={() => {setChecked(!checked)}} disabled={disabled} />
        <span className={toggleTextClasses}>{text}</span>
    </label>
    );
}

export default Checkbox;