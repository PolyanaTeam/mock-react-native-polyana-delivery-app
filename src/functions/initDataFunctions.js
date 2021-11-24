import {defaultInitData} from "../context/initData";
import {appVariable} from "../config/variableConf";
import {getPayloadErrorText, makeApiRequest} from "./requestToApi";
import {showOverlay} from "../context/overlay";

export async function getInitDataFromServer (town, dispatchOverlay) {

    let initData = defaultInitData
    const handleNetworkError = (text) => showOverlay(dispatchOverlay, text)
    const handleSuccess = (payload) => initData = payload
    const handleError = (payload) => showOverlay(dispatchOverlay, getPayloadErrorText(payload))

    await makeApiRequest(appVariable.getInitDataUrl + town,
        null,
        handleNetworkError,
        handleSuccess,
        handleError)

    return initData
}