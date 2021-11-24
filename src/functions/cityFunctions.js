import {defaultCitiesArray, setCitiesArray} from "../context/city";
import {getPayloadErrorText, makeApiRequest} from "./requestToApi";
import {appVariable} from "../config/variableConf";
import {showOverlay} from "../context/overlay";

export async function handleCitiesFromServer(dispatchOverlay, dispatchCity) {
    const cities = await getCitiesFromServer(dispatchOverlay)
    // const cities = cityTest
    if (cities !== defaultCitiesArray) setCitiesArray(dispatchCity, cities)

    return cities
}

async function getCitiesFromServer(dispatchOverlay) {
    let citiesFromServer = defaultCitiesArray
    const handleNetworkError = (text) => showOverlay(dispatchOverlay, text)
    const handleSuccess = (payload) => citiesFromServer = payload
    const handleError = (payload) => showOverlay(dispatchOverlay ,getPayloadErrorText(payload))

    await makeApiRequest(appVariable.getCityUrl, null, handleNetworkError, handleSuccess, handleError)

    return citiesFromServer
}