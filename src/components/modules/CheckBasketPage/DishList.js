import React from "react";
import {ScrollView, StyleSheet, Text, View} from "react-native";
import {DefaultButton} from "../../generics/DefaultButton";
import {appImages} from "../../../config/images";
import {fontSize} from "../../../config/styleConf";
import {addDish, deleteDishFromBasket} from "../../../context/basket";
import {getStringModifiers} from "../../../functions/modifierFunctions";

export const DishList = ({basket, dispatchBasket}) => {

    const basketLength = basket.length - 1

    return (
        <ScrollView
            style={{flex: 1}}
        >
            {
                basket.map(handleDish(dispatchBasket, basketLength))
            }
        </ScrollView>
    )
}

const handleDish = (dispatchBasket, basketLength) => {
    return (dishObj, i) => {

        const viewStyle = basketLength !== i ? {...styles.viewBottomBorder, ...styles.view} : styles.view

        return (
            <View
                key={dishObj.productId + i}
                style={viewStyle}
            >
                <View
                    style={styles.nameView}
                >
                    <Text
                        style={styles.name}
                    >
                        {dishObj.name}
                    </Text>
                    {
                        dishObj.modifiers.length ?
                            <Text
                                style={styles.modifiersNames}
                                numberOfLines={1}
                            >
                                {getStringModifiers(dishObj.modifiers)}
                            </Text>
                            :
                            null
                    }
                </View>
                <DefaultButton
                    containerStyle={styles.buttonContainer}
                    style={styles.button}
                    imageStyle={styles.buttonImage}
                    imageSource={appImages.minus}
                    borderRadius={5}
                    onPress={() => deleteDishFromBasket(dispatchBasket, dishObj)}
                />
                <Text
                    style={styles.amount}
                >
                    {dishObj.amount}
                </Text>
                <DefaultButton
                    containerStyle={styles.buttonContainer}
                    style={styles.button}
                    imageStyle={styles.buttonImage}
                    imageSource={appImages.plus}
                    borderRadius={5}
                    onPress={() => addDish(dispatchBasket, dishObj)}
                />
                <Text
                    style={styles.price}
                >
                    {dishObj.price * dishObj.amount} Р
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    view: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10
    },
    viewBottomBorder: {
        borderBottomWidth: 0.5,
        borderBottomColor: 'grey'
    },
    nameView: {
        flexDirection: 'column',
        width: '50%',
        paddingRight: 10
    },
    name: {
        fontWeight: 'bold',
        fontSize: 13
    },
    modifiersNames: {
        marginTop: 3,
        fontSize: fontSize.little,
        color: 'grey'
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    buttonContainer: {
        width: '10%',
    },
    buttonImage: {
        marginRight: 0,
        width: 15,
        height: 15
    },
    amount: {
        width: '10%',
        textAlign: 'center',
        fontSize: fontSize.small
    },
    price: {
        width: '20%',
        textAlign: 'center',
        fontSize: fontSize.small
    }
})