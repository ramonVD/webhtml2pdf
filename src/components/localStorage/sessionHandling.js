import { isAnArray } from "../htmlEdition/aux/utils";
/*Handle localStorage data between sessions
(Just load the old options an user has selected before)*/

//Just set it up as a const? Since its also a single window app...
const getStorage = () => window.localStorage;

const getFromStorage = (itemName) => {
    const result = JSON.parse(getStorage().getItem(itemName)); 
    if (result === "true") { return true;}
    else if (result === "false") { return false; }
    return result;
}

export const getFromStorageIfExists = (itemName) => {
    //Just doesnt return null
    const result = getStorage().getItem(itemName);
    if (result !== null) {
        return getFromStorage(itemName);
    }
    return undefined;
}

export const existsInStorage = (itemName) => getStorage().getItem(itemName) !== null;

export const saveInStorage = (item, value) => {getStorage().setItem(item, JSON.stringify(value));}

export const setStateAndSaveInStorage = (value, stateFunction, key) => {
    if (isAnArray(value)) {
        stateFunction(value.slice());
    } else {
        stateFunction(value);
    }
    saveInStorage(key, value);
}