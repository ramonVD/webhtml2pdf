import { setKVDictState, KV_ACTIONS } from "./keyValueAssignState";

/*Element that generates a table that is filled with the data from
an array of dicts*/

/*In this concrete case, this structure is used to assign to a specific element
in the DOM a value for some of its attributes. Specific attributes that
are able to be changed this way are found in the file kvAssignState.

It generates a table that fills up with rows of the k-v 
values as inputs, plus a button to eliminate every row.

Under it, there's a button to add an empty new k-v row or eliminate them all.

State is props from fileuploader -> optionsbox -> this:*/
const KeyValueAssign = ({ valueArray, setValueArray, options={} }) => {
    const stateArray = valueArray.slice();
    const totalRows = [];
    stateArray.forEach( (kvDict, index) => {
        const htmlSelector = kvDict.htmlSelector;
        const fontValue = kvDict.fontValue;
        const marginTopValue = kvDict.marginTopValue;
        const widthValue = kvDict.widthValue;
        const bgValue = kvDict.bgColorValue;
        totalRows.push(
            <tr key={"KVRow"+index}>
                <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-500 align-middle w-1/6">
                    <KVInput text={htmlSelector} oldState={stateArray} 
                        key={"cl"+index} pos={index} type="selector" setData={setValueArray} />
                </td>
                <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-500 align-middle w-1/6">
                    <KVInput text={fontValue} oldState={stateArray} returnType="uint"
                        key={"fn"+index} pos={index} type="fontValue" setData={setValueArray} />
                </td>
                <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-500 align-middle w-1/6">
                    <KVInput text={marginTopValue} oldState={stateArray} returnType="int"
                        key={"mt"+index} pos={index} type="marginTopValue" setData={setValueArray} />
                </td>
                <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-500 align-middle w-1/6">
                    <KVInput text={widthValue} oldState={stateArray}  returnType="uint"
                        key={"w"+index} pos={index} type="widthValue" setData={setValueArray} />
                </td>
                <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-500 align-middle w-1/6">
                    <KVInput text={bgValue} oldState={stateArray}  returnType="hex"
                        key={"bg"+index} pos={index} type="bgColorValue" setData={setValueArray} />
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
            <div className="text-center font-bold mb-3 mt-2">
                Modifica elements concrets al document (avançat)
            </div>
        {totalRows.length > 0 && <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 mb-3">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100 border-red-500">
                                <tr>
                                    <th scope="col" 
                                        className="text-center py-2 text-xs text-gray-500 uppercase align-middle">
                                        .classe o #id
                                    </th>
                                    <th scope="col" 
                                        className="py-2 text-center text-xs text-gray-500 uppercase align-middle">
                                        mida font (px)
                                    </th>
                                    <th scope="col" 
                                        className="py-2 text-center text-xs text-gray-500 uppercase align-middle">
                                        mida marge vert (px)
                                    </th>
                                    <th scope="col" 
                                        className="py-2 text-center text-xs text-gray-500 uppercase align-middle">
                                        mida horitz (px)
                                    </th>
                                    <th scope="col" 
                                        className="py-2 text-center text-xs text-gray-500 uppercase align-middle">
                                        color fons (hex)
                                    </th>
                                    <th scope="col" 
                                        className="py-2 text-center text-xs text-gray-500 uppercase align-middle">
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
        <div className="grid">
        <div className="flex justify-around">
            <AddKey oldState={valueArray} setData={setValueArray} key="addK" />
            {valueArray.length > 0 && <RemoveAllKeys oldState={valueArray} setData={setValueArray} />}
            </div>
            <div className="flex">

            </div>
        </div>
        </div>
    );
}

/*Single input element that handles setting the state data*/
const KVInput = ({ text, pos, type, returnType, oldState, setData }) => {
    const NIName = "NI-" + text.substring(0,Math.min(text.length, 3));
    return (
        <div>
            <input name={NIName} className={`appearance-none md:text-center text-gray-700 
            border border-gray-200 rounded py-3 md:px-2 px-1 leading-tight focus:outline-none
            w-full focus:bg-white focus:border-gray-500`} 
            type="text" value={text} maxLength="60"
            onChange={(e) => {
                setData(
                    setKVDictState(oldState, KV_ACTIONS.MODIFY, 
                        {pos: pos, type: type, newValue: e.target.value, returnType: returnType})
                )}}
            />
            
        </div>
    )
}

/*Button that creates a new k-v pair in the array*/
const AddKey = ({ oldState, setData }) => {
    return (
            <button className={`bg-emerald-500 text-white active:bg-emerald-600 
            font-bold uppercase text-xs px-4 py-3 rounded shadow hover:shadow-md 
            outline-none focus:outline-none mr-1 mb-2 ease-linear transition-all 
            duration-150`}
            onClick={() => {setData(setKVDictState(oldState, KV_ACTIONS.ADD))}}
            >Afegeix element</button>
    )
}

/*Button that removes the specific pos in the classname-fontsize array*/
const RemoveKey = ({ associatedPos, oldState, setData }) => {
    return (
        <div className={`text-white bg-red-500 hover:bg-red-600 font-bold uppercase 
        cursor-pointer shadow hover:shadow-md outline-none focus:outline-none
        rounded md:px-3 px-2 md:py-3 py-2 text-center sm:mx-2 md:mx-4 
        mx-1 my-2 ease-linear transition-all duration-150`}
        onClick={() => {setData(setKVDictState(oldState, KV_ACTIONS.REMOVE, associatedPos))}}
        >X</div>
    );
}

const RemoveAllKeys = ({ oldState, setData }) => {
    return (
        <button className={`text-white bg-red-500 hover:bg-red-600 font-bold uppercase 
        cursor-pointer text-xs shadow hover:shadow-md outline-none focus:outline-none
        rounded md:px-3 px-2 md:py-3 py-2 text-center sm:mx-2 md:mx-4 
        mr-1 mb-2 ease-linear transition-all duration-150`}
        onClick={() => {setData(setKVDictState(oldState, KV_ACTIONS.REMOVE, -1))}}
        >Elimina tots</button>
    ); 
}

export default KeyValueAssign;