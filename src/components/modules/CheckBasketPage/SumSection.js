import React, {useEffect, useState} from "react";
import {View, StyleSheet, Text} from "react-native";
import {colors, fontSize} from "../../../config/styleConf";
import {usePersonalInfoContext} from "../../../context/personalInfo";
import {CheckBox} from "react-native-elements";
import {formKeys, setForm, useFormContext} from "../../../context/form";
import {BonusesSlider} from "./BonusesSlider";

export const SumSection = ({sum}) => {

    const [{}, dispatchForm] = useFormContext()
    const [{personalInfo}] = usePersonalInfoContext()
    const [isShowBonusesOverlay, setIsShowBonusesOverlay] = useState(false)
    const [{bonuses}] = useFormContext()
    const accountBonuses = personalInfo?.bonuses ? personalInfo.bonuses : 0
    const availableBonuses = returnAvailableBonuses(accountBonuses, sum)

    useEffect(() => {
        if (bonuses > availableBonuses) setForm(dispatchForm, formKeys.bonuses, availableBonuses)
    }, [sum])

    return (
        <>
            <View
                style={styles.view}
            >
                <Text
                    style={styles.text}
                >
                    Итог:
                    {" "}
                    <Text
                        style={styles.sum}
                    >
                        {sum - bonuses} Р
                    </Text>
                </Text>
                {
                    personalInfo ?
                        <CheckBox
                            title={'Бонусы'}
                            checked={bonuses > 0}
                            onPress={() => setIsShowBonusesOverlay(true)}
                            checkedColor={colors.defaultColor2}
                            containerStyle={styles.checkBoxContainer}
                            textStyle={styles.checkBoxText}
                        />
                        :
                        null
                }
            </View>
            <BonusesSlider
                formBonuses={bonuses}
                isShowBonusesOverlay={isShowBonusesOverlay}
                setIsShowBonusesOverlay={setIsShowBonusesOverlay}
                maxBonuses={availableBonuses}
                dispatchForm={dispatchForm}
            />
        </>
    )
}

function returnAvailableBonuses (bonuses, sum) {
    const maxBonuses = sum * 0.3

    return bonuses >= maxBonuses ? maxBonuses : bonuses
}

const styles = StyleSheet.create({
    view: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    text: {
        width: 115,
        fontSize: fontSize.small
    },
    sum: {
        fontSize: fontSize.small,
        fontWeight: 'bold'
    },
    checkBoxContainer: {
        backgroundColor: 'white',
    },
    checkBoxText: {
        fontSize: fontSize.small,
    }
})