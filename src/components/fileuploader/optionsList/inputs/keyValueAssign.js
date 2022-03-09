import { getANumber } from "../optionsbox";

/*Element with an array of dicts that assign to a certain key a specific value*/

const KV_DEFAULT_DICT = {htmlSelector: "", fontValue: "", marginTopValue: ""};
/*In this concrete case, need an element to assign to a specific classname
in the DOM a value for its new font size. It creates a table that
fills up with rows of the k-v values as inputs, plus a button
to eliminate every pair.
Under it, there's a button to add an empty new k-v pair.

Structure of the state:
valueArray = [ KV_DEFAULT_DICT, KV_DEFAULT_DICT, ... ] */
const KeyValueAssign = ({ valueArray, setValueArray, options={} }) => {
    const stateArray = valueArray.slice();
    const totalRows = [];
    stateArray.forEach( (kvDict, index) => {
        const htmlSelector = kvDict.htmlSelector;
        const fontValue = kvDict.fontValue;
        const marginTopValue = kvDict.marginTopValue;
        totalRows.push(
            <tr key={"KVRow"+index}>
                <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-500 align-middle w-1/4">
                    <KVInput text={htmlSelector} oldState={stateArray} 
                        key={"cl"+index} pos={index} type="class" setData={setValueArray} />
                </td>
                <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-500 align-middle w-1/4">
                    <KVInput text={fontValue} oldState={stateArray} 
                        key={"fn"+index} pos={index} type="font" setData={setValueArray} />
                </td>
                <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-500 align-middle w-1/4">
                    <KVInput text={marginTopValue} oldState={stateArray} 
                        key={"fn"+index} pos={index} type="marginT" setData={setValueArray} />
                </td>
                <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-500 align-middle w-1/12">
                    <RemoveKey associatedPos={index} oldState={stateArray} 
                        setData={setValueArray} key={"rmK"+index} />
                </td>
            </tr>
            );
    });

    return (
        <div className="md:overflow-x-hidden overflow-x-scroll">
            <div className="text-center font-bold mb-2 mt-5">
                Modifica elements concrets al document (avançat)
            </div>
        {totalRows.length > 0 && <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 mb-3">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" 
                                        className="text-center py-2 text-xs font-medium text-gray-500 uppercase tracking-wider align-middle">
                                        .classe o #id
                                    </th>
                                    <th scope="col" 
                                        className="py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider align-middle">
                                        Nova mida font (px)
                                    </th>
                                    <th scope="col" 
                                        className="py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider align-middle">
                                        Nova mida marge vert (px)
                                    </th>
                                    <th scope="col" 
                                        className="py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider align-middle">
                                        Elimina
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {totalRows}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>}
            <AddKey oldState={valueArray} setData={setValueArray} key="addK" />
        </div>
    );
}

/*Single input element that handles setting the state data*/
const KVInput = ({ text, pos, type, oldState, setData }) => {
    const NIName = "NI-" + text.substring(0,Math.min(text.length, 3));
    return (
        <div>
            <input name={NIName} className={`appearance-none md:text-center text-gray-700 border
            border-gray-200 rounded py-3 px-2 leading-tight focus:outline-none w-full focus:bg-white focus:border-gray-500`} 
            type="text" value={text} maxLength="60"
            onChange={(e) => {
                setData(
                    setKVDictState(oldState, KV_ACTIONS.MODIFY, {pos: pos, type:type, newValue: e.target.value})
                )}}
            />
            
        </div>
    )
}

/*Button that creates a new k-v pair in the array*/
const AddKey = ({ oldState, setData }) => {
    return (
        <div className="flex justify-center">
            <button className={`text-white bg-green-700 hover:bg-green-800 focus:ring-4 
            focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center 
            mr-2 mt-1 mb-5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800`}
            onClick={() => {setData(setKVDictState(oldState, KV_ACTIONS.ADD))}}
            >Afegeix element</button>
        </div>
    )
}

/*Button that removes the specific pos in the classname-fontsize array*/
const RemoveKey = ({ associatedPos, oldState, setData }) => {
    return (
        <div className={`text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 cursor-pointer align-middle
        font-medium rounded md:px-3 px-2 md:py-3 py-2 text-center sm:mx-2 md:mx-4 mx-1 my-1 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900`}
        onClick={() => {setData(setKVDictState(oldState, KV_ACTIONS.REMOVE, associatedPos))}}
        >X</div>
    );
}


/*Possible actions for setting state values*/
const KV_ACTIONS = {
    REMOVE: "REMOVE",
    ADD: "ADD",
    MODIFY: "MODIFY",
}

/*State actions handling*/
function setKVDictState(oldState, action, payload) {
    const state = oldState.slice();
    //Maybe emit an event when new userstuff added doesnt work... or just use the ref...
    switch (action) {
        case KV_ACTIONS.ADD:
            state.push(KV_DEFAULT_DICT);
            return state;
        case KV_ACTIONS.REMOVE:
            state.splice(payload, 1);
            return state;
        case KV_ACTIONS.MODIFY:
            const dict = state[payload.pos];
            if (payload.type === "class") {
                dict["htmlSelector"] = payload.newValue;
            } else if (payload.type === "font") {
                dict["fontValue"] = getANumber(payload.newValue);
            } else {
                dict["marginTopValue"] = getANumber(payload.newValue);
            }
            return state;
        default:
            return state;
    }
}

export default KeyValueAssign;