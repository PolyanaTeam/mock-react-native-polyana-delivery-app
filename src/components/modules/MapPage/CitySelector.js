import React, {useEffect, useState} from "react";
import DropDownPicker from "react-native-dropdown-picker";
import {Image, StyleSheet} from "react-native";
import {borderRadius, defaultPageHorizontalSafeArea} from "../../../config/styleConf";
import {setCurrentCityObj} from "../../../context/city";
import {defaultAddressObj, formKeys, setForm} from "../../../context/form";
import {appImages} from "../../../config/images";

export const CitySelector = ({dispatchForm, addressObj, citiesArray, currentCityObj, dispatchCity}) => {

    const defaultValue = currentCityObj ? currentCityObj.order : 0
    const cityItems = citiesArray.map((v, i) => {
        return {label: v.name, value: i}
    })
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(defaultValue);
    const [items, setItems] = useState(cityItems);

    useEffect(() => {

        const currentCity = citiesArray[value]

        setCurrentCityObj(dispatchCity, currentCity)
        if (addressObj !== defaultAddressObj) {
            if (addressObj?.data?.city_fias_id !== currentCity.city_fias_id) {
                setForm(dispatchForm, formKeys.addressObj, defaultAddressObj)
            }
        }
    }, [value])

    return (
        <DropDownPicker
            placeholder={''}
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            containerStyle={styles.containerDropDownPicker}
            showTickIcon={false}
            labelStyle={styles.labelDropDownPicker}
            style={{...styles.container, ...styles.styleDropDownPicker}}
            dropDownContainerStyle={styles.container}
            ArrowUpIconComponent={() => <ArrowDownIconComponent/>}
            ArrowDownIconComponent={() => <ArrowDownIconComponent/>}
            textStyle={styles.textStyle}
        />
    )
}

const ArrowDownIconComponent = () => (
    <Image source={appImages.arrow} resizeMode={'contain'} style={styles.imgStyle}/>
)

const styles = StyleSheet.create({
    containerDropDownPicker: {
        width: 110,
        marginRight: defaultPageHorizontalSafeArea,
    },
    labelDropDownPicker: {
        fontWeight: 'bold',
    },
    container: {
        borderWidth: 0,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    styleDropDownPicker: {
        borderRadius: borderRadius.medium,
        height: 45
    },
    textStyle: {
        textAlign: 'center'
    },
    imgStyle: {
        width: 10,
        height: 10
    }
})