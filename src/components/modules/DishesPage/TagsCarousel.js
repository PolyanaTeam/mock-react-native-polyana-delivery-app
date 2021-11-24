import React, {useEffect, useRef} from "react";
import {ScrollView, StyleSheet} from "react-native";
import {Button} from "react-native-elements";
import {borderRadius, defaultPageHorizontalSafeArea, fontSize} from "../../../config/styleConf";

export const TagsCarousel = ({
    menuTag,
    rgbaPrimaryColor,
    dimension,
    name,
    setSectionProps,
    rgbaSecondaryColor,
    sectionTypes
}) => {

    const ref = useRef(null)
    const lengthTagArray = menuTag.length - 1

    useEffect(() =>{
        if (ref) ref.current.scrollTo({ x: 0, y: 0 })
    }, [menuTag])

    return (
        <ScrollView
            ref={ref}
            style={{...styles.view, width: dimension.width}}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
        >
            {
                menuTag.map((element, i) => {

                    const color = element.name === name ? rgbaSecondaryColor : rgbaPrimaryColor

                    return (
                        <Tag
                            key={element.id + i}
                            element={element}
                            index={i}
                            lengthTagArray={lengthTagArray}
                            color={color}
                            handleSetSectionProps={handleSetSectionProps}
                        />
                    )
                })
            }
        </ScrollView>
    )

    function handleSetSectionProps (name) {
        setSectionProps({type: sectionTypes.tag, props: {name: name}})
    }
}

const Tag = ({element, index, lengthTagArray, color, handleSetSectionProps}) => {

    let buttonStyle = styles.restButton
    const name = element.name

    if (index === 0) buttonStyle = styles.firstButton
    else if (index === lengthTagArray) buttonStyle = styles.lastButton

    return (
        <Button
            titleStyle={styles.titleButton}
            title={name}
            containerStyle={buttonStyle}
            buttonStyle={{...styles.defaultButton, backgroundColor: color}}
            onPress={() => handleSetSectionProps(name)}
        />
    )
}

const styles = StyleSheet.create({
    view: {
        position: 'absolute',
        left: -1 * defaultPageHorizontalSafeArea,
        top: 100
    },
    defaultButton: {
        borderRadius: borderRadius.small,
        paddingVertical: 5,
        paddingHorizontal: 10
    },
    firstButton: {
        marginLeft: defaultPageHorizontalSafeArea
    },
    lastButton: {
        marginLeft: 7,
        marginRight: defaultPageHorizontalSafeArea
    },
    restButton: {
        marginLeft: 7,
    },
    titleButton: {
        fontWeight: 'bold',
        fontSize: fontSize.medium
    }
})