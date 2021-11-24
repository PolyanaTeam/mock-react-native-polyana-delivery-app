import React, {useEffect, useState} from "react";
import {Overlay, Slider} from "react-native-elements";
import {DefaultButton} from "../../generics/DefaultButton";
import {StyleSheet, Text} from "react-native";
import {formKeys, setForm} from "../../../context/form";
import {colors, fontSize} from "../../../config/styleConf";

export const BonusesSlider = ({
    formBonuses,
    isShowBonusesOverlay,
    setIsShowBonusesOverlay,
    maxBonuses,
    dispatchForm
}) => {

    const [bonuses, setBonuses] = useState(formBonuses)

    useEffect(() => {
        if (bonuses > maxBonuses) setBonuses(maxBonuses)
    }, [maxBonuses])

    let jsx =
        <>
            <Text
                style={styles.text}
            >
                {bonuses}
            </Text>
            <Slider
                style={styles.slider}
                thumbStyle={styles.thumb}
                value={bonuses}
                onValueChange={value => setBonuses(value)}
                step={1}
                minimumValue={0}
                maximumValue={maxBonuses}
            />
        </>

    if (maxBonuses === 0) {
        jsx =
            <Text
                style={styles.text}
            >
                У вас 0 бонусов
            </Text>
    }

    return (
        <Overlay
            isVisible={isShowBonusesOverlay}
        >
            {jsx}
            <DefaultButton
                onPress={() => onPress(setIsShowBonusesOverlay, dispatchForm, bonuses)}
                title={'Принять'}
            />
        </Overlay>
    )
}

function onPress (setIsShowBonusesOverlay, dispatchForm, bonuses) {
    setIsShowBonusesOverlay(false)
    setForm(dispatchForm, formKeys.bonuses, bonuses)
}

const styles = StyleSheet.create({
    text: {
        textAlign: 'center',
        fontSize: fontSize.preMedium,
        fontWeight: 'bold',
        marginBottom: 10
    },
    slider: {
        width: 200,
        marginBottom: 10
    },
    thumb: {
        height: 20,
        width: 20,
        backgroundColor: 'white',
        borderWidth: 5,
        borderColor: colors.defaultColor2
    }
})