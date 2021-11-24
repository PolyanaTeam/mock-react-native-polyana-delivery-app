import React, {useEffect, useRef} from "react";
import WebView from "react-native-webview";
import {StyleSheet} from "react-native";
import {useCityContext} from "../../../context/city";
import {appVariable} from "../../../config/variableConf";
import {defaultAddressObj} from "../../../context/form";
import {useOverlayContext} from "../../../context/overlay";
import {getAddressViaLatLng} from "../../../functions/addressFunctions";

export const MapView = ({dispatchForm, addressObj}) => {

    let webRef = useRef()
    const [{}, dispatchOverlay] = useOverlayContext()
    const [{currentCityObj}] = useCityContext()
    const LAUNCH_JAVASCRIPT = getLaunchMapText(addressObj?.data.geo_lat, addressObj?.data.geo_lon)

    useEffect(panTo, [currentCityObj])
    useEffect(addMarkerToMap, [addressObj])

    return (
        <WebView
            ref={ref => webRef = ref}
            style={styles.view}
            source={{uri: appVariable.mapUrl}}
            injectedJavaScript={LAUNCH_JAVASCRIPT}
            onMessage={getLatLngFromWebView}
        />
    )

    function getLatLngFromWebView (event) {
        const latLngArray = JSON.parse(event.nativeEvent.data)
        if (currentCityObj) {
            getAddressViaLatLng(latLngArray, dispatchForm, currentCityObj.city_fias_id, dispatchOverlay)
        }
    }

    function panTo () {
        if (currentCityObj) {
            const query = `
                window.panTo([${currentCityObj.geo.lat}, ${currentCityObj.geo.lng}])
                true;
            `;

            webRef.injectJavaScript(query);
        }
    }

    function addMarkerToMap() {
        if (addressObj !== defaultAddressObj) {
            const query = `
                window.addMarkerToMap([${addressObj.data.geo_lat}, ${addressObj.data.geo_lon}])
                true;
            `;

            webRef.injectJavaScript(query);
        }
    }
}

function getLaunchMapText (lat = null, lon = null) {

    const params = lat && lon ? `[${lat}, ${lon}]` : ''

    return `
        window.launchMap(${params});
        true;
    `
}

const styles = StyleSheet.create({
    view: {
        flex: 1
    }
})