import React from "react";
import {Image, View, StyleSheet} from "react-native";
import {appImages} from "../../../config/images";

export const SplashView = () => {

    return (
        <View style={styles.view}>
            <Image
                style={styles.image}
                source={appImages.splash}
                resizeMode={'contain'}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#92bf39'
    },
    image: {
        width: '100%'
    }
})