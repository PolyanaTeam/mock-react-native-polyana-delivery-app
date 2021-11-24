import React from "react";
import {View, StyleSheet, Text, Image} from "react-native";
import {useFormContext} from "../../context/form";
import {fontSize} from "../../config/styleConf";
import {Button} from "react-native-elements";
import {appImages} from "../../config/images";
import {useNavigation} from "@react-navigation/native";
import {routeNameConfig} from "../../config/routeNamesConfig";
import {useBasketContext} from "../../context/basket";

export const MainHeader = () => {

    const navigation = useNavigation()
    const [{sum}] = useBasketContext()
    const [{addressObj}] = useFormContext()
    const street = addressObj.data.street
    const house = addressObj.data.house

    return (
        <View
            style={styles.view}
        >
            <View>
                <Text
                    style={styles.cityText}
                >
                    {addressObj.data.city}
                </Text>
                <Button
                    titleStyle={styles.addressButtonTitle}
                    title={`${street} ${house ? house : ''}`}
                    type={'clear'}
                    icon={() => <Image source={appImages.arrow} style={styles.arrowImage} resizeMode={'contain'}/>}
                    iconRight={true}
                    buttonStyle={styles.addressButtonButton}
                    onPress={() => navigation.navigate(routeNameConfig.appRoute.mapPage)}
                />
            </View>
            <Button
                icon={() => {
                    return (
                        <View>
                            <Image source={appImages.basketBigStock} style={styles.basketImage} resizeMode={'contain'}/>
                            <View
                                style={styles.absoluteView}
                            >
                                <Text
                                    style={styles.priceText}
                                >
                                    {sum} Р
                                </Text>
                            </View>
                        </View>
                    )
                }}
                type={'clear'}
                buttonStyle={styles.basketButton}
                onPress={() => navigation.navigate(routeNameConfig.appRoute.basketPage)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    cityText: {
        color: 'grey'
    },
    addressButtonTitle: {
        fontWeight: 'bold',
        fontSize: fontSize.small,
        marginRight: 10,
        color: 'black'
    },
    arrowImage: {
        height: 10,
        width: 10
    },
    addressButtonButton: {
        paddingHorizontal: 0,
        paddingVertical: 1
    },
    basketImage: {
        width: 60,
        height: 60
    },
    basketButton: {
        padding: 0
    },
    absoluteView: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 7,
        justifyContent: 'center',
        alignItems: 'center'
    },
    priceText: {
        fontWeight: 'bold',
        color: 'white',
        letterSpacing: -0.8
    }
})