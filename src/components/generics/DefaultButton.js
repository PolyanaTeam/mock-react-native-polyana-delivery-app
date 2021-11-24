import React from "react";
import {Button} from 'react-native-elements';
import {Image, StyleSheet} from 'react-native'
import {borderRadius, colors, fontSize} from "../../config/styleConf";

export const DefaultButton = ({
    title,
    style = {},
    imageSource = null,
    titleStyle = {},
    containerStyle = {},
    onPress = () => {},
    loading = false,
    isBorder = false,
    imageStyle = {},
    borderRadius = 15
}) => {

    const isIcon = !!imageSource
    const styleTitle = isIcon ? styles.iconTitle : {}
    const styleBorder = isBorder ? styles.border : {}
    const borderRadiusStyle = {borderRadius: borderRadius}

    return (
        <Button
            onPress={onPress}
            title={title}
            buttonStyle={{...styles.button, ...style, ...borderRadiusStyle}}
            containerStyle={{...containerStyle, ...styleBorder, ...borderRadiusStyle}}
            titleStyle={{...styles.title, ...titleStyle, ...styleTitle}}
            loading={loading}
            type={loading ? 'clear' : 'solid'}
            icon={
                isIcon ?
                    <Image
                        source={imageSource}
                        style={{...styles.image, ...imageStyle}}
                        resizeMode={'contain'}
                    />
                    :
                    null
            }
        />
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.defaultColor2,
        paddingVertical: 10
    },
    title: {
        fontWeight: '600',
        fontSize: fontSize.preMedium
    },
    image: {
        height: 30,
        width: 30,
        marginRight: 15
    },
    border: {
        borderWidth: 1,
        borderColor: colors.defaultColor2
    },
    iconTitle: {
        paddingRight: 30
    }
})