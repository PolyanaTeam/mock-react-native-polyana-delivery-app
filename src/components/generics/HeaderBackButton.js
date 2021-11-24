import React from "react";
import {StyleSheet} from "react-native";
import {borderRadius, colors, defaultPageHorizontalSafeArea, fontSize} from "../../config/styleConf";
import {Button} from "react-native-elements";

export const HeaderBackButton = ({navigation, routeName}) => {

    let onPress = () => navigation.goBack()

    if (routeName) onPress = () => navigation.navigate(routeName)

    return (
        <Button
            onPress={onPress}
            title={'Назад'}
            containerStyle={styles.container}
            buttonStyle={styles.button}
            type={'clear'}
            titleStyle={styles.title}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: borderRadius.medium
    },
    button: {
        paddingHorizontal: defaultPageHorizontalSafeArea
    },
    title: {
        fontSize: fontSize.medium,
        color: colors.defaultColor2
    }
})