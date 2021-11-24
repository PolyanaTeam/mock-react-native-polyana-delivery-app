import {makeDadataRequest} from "./dadataFunctions";
import {showOverlay} from "../context/overlay";
import {formKeys, setForm} from "../context/form";
import {getItemFromStorage} from "./storageFunction";
import {appVariable} from "../config/variableConf";
import {setCurrentCityObj} from "../context/city";

export async function getAddressViaLatLng (latLngArray, dispatchForm, city_fias_id, dispatchOverlay) {

    const response = await makeDadataRequest(
        "https://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/address",
        {
            lat: latLngArray[0],
            lon: latLngArray[1],
            count: 1
        }
    )

    try {
        const json = await response.json()
        const addressObj = json.suggestions[0]

        if (!addressObj || city_fias_id !== addressObj.data.city_fias_id) {
            showOverlay(dispatchOverlay, 'Адрес не входит в зону выбранного города')
        }
        else {
            setForm(dispatchForm, formKeys.addressObj, addressObj)
        }
    } catch (e) {
        console.log('error')
    }
}

export async function handleAddressFromStorage(dispatchForm, cities, dispatchCity) {
    const stringAddress = await getItemFromStorage(appVariable.storageKeys.addressObj)

    if (!stringAddress) return

    const addressObj = JSON.parse(stringAddress)

    for (let i = 0; i < cities.length; i++) {

        const cityObj = cities[i]

        if (addressObj.data.city_fias_id !== cityObj.city_fias_id) continue

        setForm(dispatchForm, formKeys.addressObj, addressObj)
        setCurrentCityObj(dispatchCity, cityObj)
        return
    }
}