import React from 'react'
import {StyleSheet} from "react-native";

export const bottomImageTitle = (width, backgroundColor, bottom, left, fontSize, borderRadius) => {
    return StyleSheet.create({
        viewText: {
            borderBottomLeftRadius: borderRadius,
            borderBottomRightRadius: borderRadius,
            position: 'absolute',
            bottom: bottom,
            left: left,
            justifyContent: 'center',
            alignContent: "center",
            alignItems: 'flex-start',
            width: width,
            backgroundColor: backgroundColor
        },
        textStyle: {
            padding: 5,
            fontSize: fontSize,
            fontWeight: 'bold',
            color: 'white'
        }
    })
}