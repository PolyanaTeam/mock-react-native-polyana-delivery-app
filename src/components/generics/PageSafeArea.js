import React from "react";
import {StyleSheet, View} from "react-native";

export const PageSafeArea = ({children}) => {
    return (
        <View
            style={styles.view}
        >
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        marginTop: 40
    }
})