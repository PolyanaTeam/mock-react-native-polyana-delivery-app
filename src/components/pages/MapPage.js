import React, {useRef} from "react";
import {PageSafeArea} from "../generics/PageSafeArea";
import {Image, StyleSheet, View} from "react-native";
import {HeaderBackButton} from "../generics/HeaderBackButton";
import {DefaultHeader} from "../generics/DefaultHeader";
import {useNavigation} from "@react-navigation/native";
import {borderRadius, defaultPageHorizontalSafeArea} from "../../config/styleConf";
import {Button} from "react-native-elements";
import {CitySelector} from "../modules/MapPage/CitySelector";
import {BottomInformView} from "../modules/MapPage/BottomInformView";
import {MapView} from "../modules/MapPage/MapView";
import {useFormContext} from "../../context/form";
import {SearchAddressBottomSheet} from "../modules/MapPage/SearchAddressBottomSheet";
import {getCurrentPositionAsync, requestForegroundPermissionsAsync} from 'expo-location';
import {getAddressViaLatLng} from "../../functions/addressFunctions";
import {useCityContext} from "../../context/city";
import {useOverlayContext} from "../../context/overlay";
import {appImages} from "../../config/images";

export const MapPage = () => {

    const bottomSheetRef = useRef()
    const navigation = useNavigation()
    const [{addressObj}, dispatchForm] = useFormContext()
    const [{currentCityObj, citiesArray}, dispatchCity] = useCityContext()
    const [{}, dispatchOverlay] = useOverlayContext()

    return (
        <PageSafeArea>
            <DefaultHeader>
                <HeaderBackButton
                    navigation={navigation}
                />
                <CitySelector
                    dispatchForm={dispatchForm}
                    addressObj={addressObj}
                    currentCityObj={currentCityObj}
                    citiesArray={citiesArray}
                    dispatchCity={dispatchCity}
                />
            </DefaultHeader>
            <View
                style={styles.view}
            >
                <View
                    style={styles.topView}
                >
                    <MapView
                        dispatchForm={dispatchForm}
                        addressObj={addressObj}
                    />
                    <Button
                        containerStyle={styles.geoMarker}
                        type={'clear'}
                        buttonStyle={styles.geoMarkerButton}
                        icon={<Image source={appImages.geo} resizeMode={'contain'} style={styles.geoImage}/> }
                        onPress={() => onClickGeo(dispatchForm, currentCityObj, dispatchOverlay)}
                    />
                </View>
                <BottomInformView
                    addressObj={addressObj}
                    ref={bottomSheetRef}
                    currentCityObj={currentCityObj}
                    dispatchOverlay={dispatchOverlay}
                    navigation={navigation}
                />
            </View>
            <SearchAddressBottomSheet
                ref={bottomSheetRef}
                currentCityObj={currentCityObj}
                dispatchForm={dispatchForm}
            />
        </PageSafeArea>
    )
}

async function onClickGeo(dispatchForm, currentCityObj, dispatchOverlay) {

    const status = await requestForegroundPermissionsAsync()

    if (status.status === 'granted') {
        let location = await getCurrentPositionAsync({accuracy: 3})
        const {latitude, longitude} = location.coords
        const latLngArray = [latitude, longitude]

        getAddressViaLatLng(latLngArray, dispatchForm, currentCityObj.city_fias_id, dispatchOverlay)
    }
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        marginTop: 20
    },
    topView: {
        flex: 1
    },
    geoMarker: {
        position: 'absolute',
        bottom: 40,
        right: defaultPageHorizontalSafeArea,
        width: 40,
        height: 40
    },
    geoMarkerButton: {
        padding: 0,
        borderRadius: borderRadius.medium
    },
    geoImage: {
        width: 40,
        height: 40
    }
})