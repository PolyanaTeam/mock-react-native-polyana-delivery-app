import {getItemFromStorage, setItemToStorage} from "./storageFunction";
import {appVariable} from "../config/variableConf";
import {
    defaultPersonalInfo,
    personalInfoStatusType, setPersonalInfo,
    setPersonalInfoFromServer,
    setPersonalInfoStatus
} from "../context/personalInfo";
import {makeApiRequest} from "./requestToApi";
import {formKeys, setFormCombine} from "../context/form";

export async function handlePersonalInfo(dispatchPersonalInfo, dispatchForm) {
    const jsession = await getItemFromStorage(appVariable.storageKeys.jsession)

    if (jsession) {
        const personalInfo = await getPersonalInfoFromServer(jsession, dispatchPersonalInfo)

        if (personalInfo) handlePersonalData(dispatchPersonalInfo, dispatchForm, personalInfo)
        else setPersonalInfoStatus(dispatchPersonalInfo, personalInfoStatusType.notSignIn)
    }
    // handlePersonalData(dispatchPersonalInfo, dispatchForm, personalInfoTest)
}

export function handlePersonalData (dispatchPersonalInfo, dispatchForm, personalInfoPayload) {

    const jsession = personalInfoPayload.jsession
    const personalInfo = personalInfoPayload.PersonalInfo
    const ordersHistory = personalInfoPayload.ordersHistory
    const name = personalInfo.name
    const phone = personalInfo.phone

    setItemToStorage(appVariable.storageKeys.jsession, jsession)
    setPersonalInfoFromServer(dispatchPersonalInfo, personalInfo, personalInfoStatusType.signIn, jsession,
        ordersHistory)
    setFormCombine(dispatchForm, [
        {
            name: formKeys.name,
            value: name
        },
        {
            name: formKeys.phone,
            value: phone
        }
    ])
}

async function getPersonalInfoFromServer(jsession, dispatchPersonalInfo) {
    let personalInfo = defaultPersonalInfo
    const handleNetworkError = () => {}
    const handleSuccess = (payload) => personalInfo = payload
    const handleError = () => {}

    setPersonalInfoStatus(dispatchPersonalInfo, personalInfoStatusType.downloading)

    await makeApiRequest(appVariable.checkSessionUrl,
        {jsession: jsession},
        handleNetworkError,
        handleSuccess,
        handleError)

    return personalInfo
}

export function setCurrentBonuses(dispatchPersonalInfo, personalInfo, bonuses) {
    personalInfo.bonuses = bonuses

    setPersonalInfo(dispatchPersonalInfo, personalInfo)
}