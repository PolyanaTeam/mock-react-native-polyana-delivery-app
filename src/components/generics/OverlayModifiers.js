import React, {useEffect, useState} from "react";
import {CheckBox, Overlay} from "react-native-elements";
import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {borderRadius, colors, fontSize} from "../../config/styleConf";
import {DefaultButton} from "./DefaultButton";
import {appImages} from "../../config/images";
import {
    checkNecessaryModifiers,
    editModifiersArray,
    getSumModifiers,
    isIncludeModifier
} from "../../functions/modifierFunctions";
import {addDish} from "../../context/basket";

export const OverlayModifiers = ({isVisible, hide, dish, basketConceptIndex, dispatchBasket}) => {

    const [modifiers, setModifiers] = useState([])

    useEffect(() => setModifiers([]), [isVisible])

    return (
        <Overlay
            onBackdropPress={hide}
            isVisible={isVisible}
            backdropStyle={styles.backdrop}
            overlayStyle={styles.overlay}
        >
            <ModifierSection
                dish={dish}
                modifiers={modifiers}
                setModifiers={setModifiers}
            />
            <BottomSection
                dish={dish}
                modifiers={modifiers}
                hide={hide}
                basketConceptIndex={basketConceptIndex}
                dispatchBasket={dispatchBasket}
            />
            <TouchableOpacity
                style={{position: "absolute", top: -30, right: 0}}
                onPress={hide}
            >
                <Image
                    style={{width: 30, height: 30}}
                    source={appImages.times}
                    resizeMode={"contain"}
                />
            </TouchableOpacity>
        </Overlay>
    )
}

const ModifierSection = ({dish, modifiers, setModifiers}) => {

    return (
        <ScrollView>
            {
                dish.modifiers.map((parentModifier, parentIndex) => (
                    <View
                        key={parentModifier.id + parentIndex}
                    >
                        <Text
                            style={styles.groupName}
                        >
                            {
                                parentModifier.name
                            }
                        </Text>
                        <Modifiers
                            parentModifier={parentModifier}
                            modifiers={modifiers}
                            setModifiers={setModifiers}
                        />
                    </View>
                ))
            }
        </ScrollView>
    )
}

const Modifiers = ({parentModifier, modifiers, setModifiers}) => (
    <>
        {
            parentModifier.childModifiers.map((childModifier, childIndex) => {

                const key = childModifier.id + childIndex
                const onPress = () => editModifiersArray(childModifier, parentModifier, modifiers, setModifiers)
                const price = childModifier.price
                const name = childModifier.name
                const title = price ? `${name} + ${price} руб` : name

                if (parentModifier.maxAmount === 1) {
                    return (
                        <CheckBox
                            key={key}
                            title={title}
                            checked={isIncludeModifier(modifiers, childModifier.id, parentModifier.id)}
                            checkedIcon={'dot-circle-o'}
                            uncheckedIcon={'circle-o'}
                            checkedColor={colors.defaultColor2}
                            containerStyle={styles.checkBoxContainer}
                            textStyle={styles.checkBoxText}
                            onPress={onPress}
                        />
                    )
                }

                return (
                    <CheckBox
                        key={key}
                        title={title}
                        checked={isIncludeModifier(modifiers, childModifier.id, parentModifier.id)}
                        checkedColor={colors.defaultColor2}
                        containerStyle={styles.checkBoxContainer}
                        textStyle={styles.checkBoxText}
                        onPress={onPress}
                    />
                )
            })
        }
    </>
)

const BottomSection = ({dish, modifiers, basketConceptIndex, dispatchBasket, hide}) => {

    const [tooltipObj, setTooltipObj] = useState({show: false, text: ''})
    const [timer, setTimer] = useState(setTimeout(() => {}, 0))

    useEffect(() =>{
        return () => clearTimeout(timer)
    }, [])

    return (
        <View
            style={styles.bottomView}
        >
            <Text
                style={styles.price}
            >
                {dish?.price + getSumModifiers(modifiers)} руб
            </Text>
            <DefaultButton
                title={'Добавить'}
                onPress={() => onPressAddButton(
                    dish,
                    modifiers,
                    dispatchBasket,
                    basketConceptIndex,
                    setTooltipObj,
                    timer,
                    setTimer,
                    hide
                )}
            />
            <Tooltip
                tooltipObj={tooltipObj}
            />
        </View>
    )
}

function onPressAddButton (dish, modifiers, dispatchBasket, basketConceptIndex, setTooltipObj, timer, setTimer, hide) {
    const checkAnswer = checkNecessaryModifiers(dish.modifiers, modifiers)

    if (checkAnswer === null) {

        const dishObj = JSON.parse(JSON.stringify(dish))
        dishObj.oldPrice = dishObj.price
        dishObj.price = dishObj.oldPrice + getSumModifiers(modifiers)
        dishObj.modifiers = modifiers

        addDish(dispatchBasket, dishObj, basketConceptIndex)
        hide()
    }
    else {
        const currentTimer = setTimeout(() => setTooltipObj({show: false, text: ''}), 2000)

        clearTimeout(timer)
        setTimer(currentTimer)
        setTooltipObj({show: true, text: checkAnswer})
    }
}

const Tooltip = ({tooltipObj}) => {

    if (!tooltipObj.show) return null

    return (
        <View
            style={styles.tooltipView}
        >
            <Text
                style={styles.tooltipText}
            >
                {`Выберите ${tooltipObj.text}`}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    backdrop: {
        backgroundColor: colors.defaultColor5
    },
    overlay: {
        borderRadius: borderRadius.medium,
        width: 300,
        height: 500
    },
    price: {
        fontSize: fontSize.small,
        fontWeight: 'bold'
    },
    bottomView: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    groupName: {
        fontSize: fontSize.small,
        fontWeight: 'bold',
        marginVertical: 10
    },
    checkBoxContainer: {
        backgroundColor: 'white',
    },
    checkBoxText: {
        fontSize: 13
    },
    tooltipView: {
        position: 'absolute',
        right: 0,
        bottom: '110%',
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: colors.defaultColor6,
        borderRadius: borderRadius.medium,
    },
    tooltipText: {
        fontSize: fontSize.small
    }
})