import React from "react";
import {Overlay} from "react-native-elements";
import {Text, StyleSheet} from "react-native";
import {borderRadius, colors, fontSize} from "../../../config/styleConf";
import {DefaultButton} from "../../generics/DefaultButton";
import {hideOverlay, useOverlayContext} from "../../../context/overlay";

export const OverlayModalWindow = () => {

    const [{text, show}, dispatchOverlay] = useOverlayContext()

    return (
        <Overlay
            onBackdropPress={hide}
            isVisible={show}
            backdropStyle={styles.backdrop}
            overlayStyle={styles.overlay}
        >
            <Text
                style={styles.text}
            >
                {text}
            </Text>
            <DefaultButton
                containerStyle={styles.button}
                title={'Понятно'}
                onPress={hide}
            />
        </Overlay>
    )

    function hide() {
        hideOverlay(dispatchOverlay)
    }
}

const styles = StyleSheet.create({
    backdrop: {
        backgroundColor: colors.defaultColor5
    },
    overlay: {
        borderRadius: borderRadius.medium,
        width: 300
    },
    text: {
        textAlign: 'center',
        marginTop: 10,
        fontWeight: '700',
        fontSize: fontSize.medium
    },
    button: {
        marginTop: 20
    }
})