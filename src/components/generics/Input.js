import React from "react";
import {TextInput as InputRN, StyleSheet, Text, View, TouchableOpacity} from "react-native";
import {borderRadius, colors, fontSize} from "../../config/styleConf";

export const Input = ({
    containerStyle = {},
    textStyle = {},
    inputStyle = {},
    text = '',
    placeholder = '',
    value = '',
    onChangeText = () => {},
    onPress = null,
    isDisabled = false,
    keyboardType = 'default'
}) => {

    const disabledStyle = isDisabled ? {opacity: 0.5} : {}

    let input =
        <InputRN
            keyboardType={keyboardType}
            editable={!isDisabled}
            selectTextOnFocus={!isDisabled}
            style={{...styles.input, ...inputStyle, ...disabledStyle}}
            value={value}
            placeholder={placeholder}
            onChangeText={onChangeText}
        />

    if (onPress) {
        input =
            <TouchableOpacity
                onPress={onPress}
                style={{...styles.input, ...inputStyle, ...disabledStyle}}
                disabled={isDisabled}
            >
                <Text
                    numberOfLines={1}
                    style={styles.touchableText}
                >
                    {value}
                </Text>
            </TouchableOpacity>
    }

    text = text ?
        <Text
            style={{...styles.text, ...textStyle}}
        >
            {text}
        </Text>
        :
        null

    return (
        <View
            style={{...styles.container, ...containerStyle}}
        >
            {text}
            {input}
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        height: 45,
        borderWidth: 2,
        borderColor: colors.defaultColor2,
        borderRadius: borderRadius.small,
        paddingVertical: 10,
        paddingHorizontal: 13,
        fontSize: fontSize.small,
        fontWeight: '700',
        justifyContent: 'center'
    },
    text: {
        marginBottom: 5,
        fontSize: fontSize.preMedium,
    },
    touchableText: {
        fontSize: fontSize.preMedium,
        fontWeight: '700'
    }
})