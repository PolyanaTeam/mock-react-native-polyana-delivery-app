import {appVariable} from "../config/variableConf";

export function getPhoneKeyboardType () {
    return appVariable.isIOS ? 'numbers-and-punctuation' : 'phone-pad'
}