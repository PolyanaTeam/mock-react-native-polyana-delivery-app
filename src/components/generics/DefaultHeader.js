import React from "react";
import {View, StyleSheet, Platform} from "react-native";

export const DefaultHeader = ({children}) => {

    const iosStyle = Platform.OS === 'ios' ? styles.iosView : {}

    return (
        <View
            style={{...styles.container, ...iosStyle}}
        >
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    iosView: {
        zIndex: 10
    }
})