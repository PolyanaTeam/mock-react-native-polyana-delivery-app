import React from "react";
import {View, StyleSheet} from "react-native";
import {defaultPageHorizontalSafeArea} from "../../config/styleConf";

export const PageHorizontalSafeArea = ({children, style}) => {
    return (
        <View
            style={{...styles.container, ...style}}
        >
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: defaultPageHorizontalSafeArea
    }
})