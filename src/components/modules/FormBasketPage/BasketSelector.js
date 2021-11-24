import React, {useEffect, useState} from "react";
import {Image, StyleSheet, Text} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import {appImages} from "../../../config/images";
import {borderRadius, colors, defaultPageHorizontalSafeArea, fontSize} from "../../../config/styleConf";

export const BasketSelector = ({
    text,
    containerStyle,
    itemsArray,
    valueDefault,
    handleValue,
    placeholder = '',
    zIndex = 1
}) => {

    //[{label: 'Доставка', value: 0}, {label: 'Самовывоз', value: 1}]

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(valueDefault);
    const [items, setItems] = useState(itemsArray);
    const styleDropDownPicker = open ? {...styles.style, borderBottomWidth: 0} : styles.style

    useEffect(() => {
        handleValue(value)
    }, [value])

    return (
        <>
            <Text
                style={styles.topText}
            >
                {text}
            </Text>
            <DropDownPicker
                zIndex={zIndex}
                placeholder={placeholder}
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                containerStyle={{...styles.container, ...containerStyle}}
                showTickIcon={false}
                labelStyle={styles.labelDropDownPicker}
                style={{...styles.container, ...styleDropDownPicker}}
                dropDownContainerStyle={styles.dropDownContainer}
                ArrowUpIconComponent={() => <ArrowDownIconComponent/>}
                ArrowDownIconComponent={() => <ArrowDownIconComponent/>}
                textStyle={styles.textStyle}
            />
        </>
    )
}

const ArrowDownIconComponent = () => (
    <Image source={appImages.arrow} resizeMode={'contain'} style={styles.imgStyle}/>
)

const styles = StyleSheet.create({
    topText: {
        marginBottom: 5,
        fontSize: fontSize.preMedium,
    },
    container: {
        marginRight: defaultPageHorizontalSafeArea,
    },
    labelDropDownPicker: {
        fontWeight: 'bold',
    },
    dropDownContainer: {
        borderRadius: borderRadius.small,
        borderColor: colors.defaultColor2,
        borderWidth: 2,
        backgroundColor: 'white',
        borderTopWidth: 0
    },
    style: {
        height: 45,
        borderRadius: borderRadius.small,
        borderColor: colors.defaultColor2,
        borderWidth: 2
    },
    textStyle: {
        fontSize: fontSize.small,
    },
    imgStyle: {
        width: 10,
        height: 10
    }
})