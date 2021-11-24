import React from 'react'
import {View, StyleSheet, Text, Linking} from "react-native";
import {DefaultButton} from "../../generics/DefaultButton";
import {appVariable} from "../../../config/variableConf";
import {fontSize} from "../../../config/styleConf";

export const UpdateVersionView = () => {

    const AppStoreUrl = "https://apps.apple.com/ru/app/%D0%BF%D0%BE%D0%BB%D1%8F%D0%BD%D0%B0-delivery/id1538286767"
    const PlayMarketUrl = "https://play.google.com/store/apps/details?id=polyanaDelivery.ru.polyanaDelivery&hl=ru&gl=US"
    const url = appVariable.isIOS ? AppStoreUrl : PlayMarketUrl

    return (
        <View
            style={styles.view}
        >
            <Text
                style={styles.text}
            >
                Пожалуйста, обновите приложение, текущая версия устарела
            </Text>
            <DefaultButton
                title={"Обновить"}
                onPress={() => Linking.openURL(url)}
                style={styles.button}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center"
    },
    text: {
        fontSize: fontSize.big,
        textAlign: 'center',
        fontWeight: 'bold',
        marginHorizontal: 20,
        marginBottom: 20
    },
    button: {
        width: 200
    }
})