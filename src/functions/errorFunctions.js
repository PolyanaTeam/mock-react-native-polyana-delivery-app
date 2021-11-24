import {appVariable} from "../config/variableConf";
import {showOverlay} from "../context/overlay";
import {setCurrentBonuses} from "./accauntFunctions";

export function getErrorObj(errorCode, action) {
    return {
        errorCode: errorCode,
        action: action
    }
}

export function getErrorBonusesLack(dispatchOverlay, dispatchPersonalInfo, personalInfo) {

    const errorCode = appVariable.apiErrorCodes.bonusesLack
    const action = (payload, errorText) => {
        setCurrentBonuses(dispatchPersonalInfo, personalInfo, payload.bonuses)
        showOverlay(dispatchOverlay, errorText)
    }

    return getErrorObj(errorCode, action)
}