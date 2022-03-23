import { copyUserEdits } from "../optionsState";
import { getAHexNumber, getANumber, copyDict } from "../aux/inputUtils";

/*Default dictionary containing the values for each selector*/
const KV_DEFAULT_DICT_STRUCTURE = {htmlSelector: "", fontValue: "",
marginTopValue: "", widthValue: "", bgColorValue: ""};

/*Possible actions for setting state values*/
export const KV_ACTIONS = {
    REMOVE: "REMOVE",
    ADD: "ADD",
    MODIFY: "MODIFY",
}

/*State actions handling, adding a row to the table, removing it, or
changing one of the values for a selector.
Structure -> [ KV_DEFAULT_DICT, KV_DEFAULT_DICT, ... ] where every
dict is a row in the table*/
export function setKVDictState(oldState, action, payload) {
    const state = copyUserEdits(oldState.slice());
    switch (action) {
        case KV_ACTIONS.ADD:
            state.push(copyDict(KV_DEFAULT_DICT_STRUCTURE));
            return state;
        case KV_ACTIONS.REMOVE:
            if (payload < 0) {
                return [];
            }
            state.splice(payload, 1);
            return state;
        case KV_ACTIONS.MODIFY:
            const dict = state[payload.pos];
            const affectedKey =  payload.type;
            const returnType = payload.returnType;
            
            if (affectedKey === "selector") {
                dict["htmlSelector"] = payload.newValue;
            } else {
                if (dict.hasOwnProperty(affectedKey)) {
                    if (returnType === "hex") {
                        dict[affectedKey] = getAHexNumber(payload.newValue);
                    } else {
                        const canBeNegative = (returnType === "uint" || returnType === "ufloat") ? false : true;
                        const isFloat = (returnType === "float" || returnType === "ufloat") ? true : false;
                        dict[affectedKey] = getANumber(payload.newValue, 
                            {isFloat: isFloat, canBeNegative: canBeNegative });
                    }
                }
            }
            return state;
        default:
            return state;
    }
}