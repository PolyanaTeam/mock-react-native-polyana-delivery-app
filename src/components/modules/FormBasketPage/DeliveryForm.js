import React from "react";
import {StyleSheet, View} from "react-native";
import {Input} from "../../generics/Input";
import {routeNameConfig} from "../../../config/routeNamesConfig";
import {formKeys, setForm} from "../../../context/form";
import {getPhoneKeyboardType} from "../../../functions/inputFunctons";

export const DeliveryForm = ({addressObj, flat, entrance, floor, doorphone, navigation, dispatchForm}) => {

    return (
        <>
            <Input
                text={'Адрес*'}
                value={addressObj.value}
                containerStyle={styles.marginBottomContainer}
                onPress={() => navigation.navigate(routeNameConfig.appRoute.mapPage)}
            />
            <View
                style={{...styles.marginBottomContainer, ...styles.doubleView}}
            >
                <Input
                    text={'Квартира*'}
                    value={flat}
                    onChangeText={value => setForm(dispatchForm, formKeys.flat, value)}
                    containerStyle={styles.doubleInput}
                    keyboardType={getPhoneKeyboardType()}
                />
                <Input
                    text={'Подъезд'}
                    value={entrance}
                    onChangeText={value => setForm(dispatchForm, formKeys.entrance, value)}
                    containerStyle={styles.doubleInput}
                    keyboardType={getPhoneKeyboardType()}
                />
            </View>
            <View
                style={{...styles.marginBottomContainer, ...styles.doubleView}}
            >
                <Input
                    text={'Этаж'}
                    value={floor}
                    onChangeText={value => setForm(dispatchForm, formKeys.floor, value)}
                    containerStyle={styles.doubleInput}
                    keyboardType={getPhoneKeyboardType()}
                />
                <Input
                    text={'Домофон'}
                    value={doorphone}
                    onChangeText={value => setForm(dispatchForm, formKeys.doorphone, value)}
                    containerStyle={styles.doubleInput}
                    keyboardType={getPhoneKeyboardType()}
                />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    marginBottomContainer: {
        marginBottom: 10
    },
    doubleView: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    doubleInput: {
        width: '49%'
    }
})