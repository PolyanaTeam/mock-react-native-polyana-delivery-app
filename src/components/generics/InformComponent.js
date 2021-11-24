import React from "react";
import {useNavigation} from "@react-navigation/native";
import {Image, Text, View, StyleSheet} from "react-native";
import {DefaultButton} from "./DefaultButton";
import {fontSize} from "../../config/styleConf";
import {appImages} from "../../config/images";

export const InformComponent = ({
    continuePath,
    containerStyle = {},
}) => {

    const navigation = useNavigation()

    return (
        <View
            style={{...containerStyle, ...styles.container}}
        >
            <View
                style={styles.view}
            >
                <Image
                    style={styles.image}
                    source={appImages.checkActive}
                    resizeMode="contain"
                />
                <Text
                    style={styles.text}
                >
                    Успешно
                </Text>
            </View>
            <DefaultButton
                containerStyle={styles.button}
                title={'Продолжить'}
                onPress={onPress}
            />
        </View>
    )

    function onPress () {
        if (continuePath) navigation.navigate(continuePath)
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between'
    },
    text: {
        marginTop: 20,
        fontSize: fontSize.huge,
        fontWeight: 'bold',
    },
    button: {
        marginBottom: 20
    },
    view: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        height: 100,
        width: 100
    }
})