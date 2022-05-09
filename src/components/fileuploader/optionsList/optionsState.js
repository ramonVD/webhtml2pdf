import { getFromStorageIfExists, saveInStorage } from "../../localStorage/sessionHandling";
import { isAnArray } from "../../htmlEdition/aux/utils";
import { copyDict, isDict } from "./aux/inputUtils";

/*Edit HTML DEFAULTS:*/
export const EDIT_VIDEOS_STATE_TEXT = [
    "Mostra imatge vídeos",
    "Mostra imatge i enllaç vídeos",
    "Només mostra enllaç vídeos"
];

//Defaults to a default value if the first one couldnt be loaded from storage...
const storageOrDefault = (propertyName) => {
    const storedValue = getFromStorageIfExists(propertyName);
    if ( storedValue === null || storedValue === undefined ) { 
        if (isAnArray(defaultUserOptions[propertyName])) {
            return copyUserEdits(defaultUserOptions[propertyName]);
        }
        return defaultUserOptions[propertyName];
    }
    return storedValue;
}


/*Default values from userOptions, load values on storage when
app is opened if there are any*/
const defaultUserOptions = {
    bodyFontSize: "1.4",
    selectedFontType: "em",
    increaseFixedSize: 8,
    noNbsp: true,
    addTitlePage: true,
    videoImgsState: 1,
    removeDetails: true,
    removeIndex: false,
    popoverAfter: true,
    popoverCenter: false,
    cleanVideoDivs: true,
    userEdits:  [{
        htmlSelector: ".exemple", fontValue: "20",
        marginTopValue: "", widthValue: "",
        bgColorValue:""
    },
    {
        htmlSelector: ".Wirisformula", fontValue: "",
        marginTopValue: "", widthValue: "5",
        bgColorValue:""
    },
    {
        htmlSelector: "body", fontValue: "",
        marginTopValue: "", widthValue: "",
        bgColorValue:"#FFFFFF"}],
  }

  /*Not very well done tbh... resets all state values to their defaults*/
export const resetUserOptions = (stateSetters) => {
    for (const key of Object.keys(defaultUserOptions)) {
        saveInStorage(key, defaultUserOptions[key]);
    }
    stateSetters.setBodyFontSize(defaultUserOptions.bodyFontSize);
    stateSetters.setSelectedFontType(defaultUserOptions.selectedFontType);
    stateSetters.setIncreaseFixedSize(defaultUserOptions.increaseFixedSize);
    stateSetters.setVideoImgsState(defaultUserOptions.videoImgsState);
    stateSetters.setRemoveDetails(defaultUserOptions.removeDetails);
    stateSetters.setRemoveIndex(defaultUserOptions.removeIndex);
    stateSetters.setAddTitlePage(defaultUserOptions.addTitlePage);
    stateSetters.setUserEdits(copyUserEdits(defaultUserOptions.userEdits));
    stateSetters.setNoNbsp(defaultUserOptions.noNbsp);
    stateSetters.setPopoverAfter(defaultUserOptions.popoverAfter);
    stateSetters.setPopoverCenter(defaultUserOptions.popoverCenter);
    stateSetters.setCleanVideoDivs(defaultUserOptions.cleanVideoDivs);
}

/*Load values from storage if there are any,
if there arent use the default values*/
export const getUserOptionsState = () => {
    const finalDict = {};
    for (const key of Object.keys(defaultUserOptions)) {
        finalDict[key] = storageOrDefault(key);
    }
    return finalDict;
}

export const nonEditableOptions = {
    navs: {
        PADDING_INFERIOR_TABS: 10,
        MARGIN_INFERIOR_TABS: 15,
        VORA_INFERIOR_TABS: "2px solid black",
    }
}

/*Creates a copy of the array of dicts that is userEdits, all
dicts are copies of old dicts as to not run into reference issues*/
export const copyUserEdits = (userEditsArray) => {
    return userEditsArray.map( (el) => {
        if (isDict(el)) { return copyDict(el); }
        return el;
    });
}