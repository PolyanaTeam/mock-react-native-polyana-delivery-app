import React, {useEffect, useRef} from "react";
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {borderRadius, defaultPageHorizontalSafeArea} from "../../../config/styleConf";
import {bottomImageTitle} from "../../../styles/bottomImageTitle";
import {Image} from "react-native-expo-image-cache";
import {BackgroundImage} from "react-native-elements/dist/config";
import {appImages} from "../../../config/images";

export const CategoriesCarousel = ({
    menu,
    categoryIndex,
    rgbaPrimaryColor,
    rgbaSecondaryColor,
    dimension,
    setSectionProps,
    sectionTypes
}) => {

    const ref = useRef(null)
    const numColumns = 1
    const buttonWidth = 107
    const menuLength = menu.length - 1
    const isCategoryIndex = categoryIndex !== undefined

    useEffect(() =>{
        if (ref) ref.current.scrollToOffset({animated: false, offset: 0})
    }, [menu])

    useEffect(() => {
        if (ref && isCategoryIndex) ref.current.scrollToIndex({animated: true, index: categoryIndex});
    }, [categoryIndex])

    return (
        <FlatList
            ref={ref}
            style={{...styles.flatList, width: dimension.width}}
            data={menu}
            keyExtractor={item => item.id + item.order}
            numColumns={numColumns}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            initialNumToRender={6}
            getItemLayout={
                (data, index) => (
                    { index, length: buttonWidth, offset: buttonWidth * index })
            }
            renderItem={({item, index}) => {

                let color = index === categoryIndex? rgbaSecondaryColor : rgbaPrimaryColor

                return (
                    <CategoryItem
                        item={item}
                        index={index}
                        menuLength={menuLength}
                        color={color}
                        handleSetSectionProps={handleSetSectionProps}
                    />
                )
            }}
        />
    )

    function handleSetSectionProps (index) {
        setSectionProps({type: sectionTypes.category, props: {categoryIndex: index}})
    }
}

const CategoryItem = ({item, index, menuLength, color, handleSetSectionProps}) => {

    let styleTouchableOpacity = styles.restImage
    const bottomImageTitleStyle = bottomImageTitle(
        100, color,
        0, 0, 10, borderRadius.small
    )
    const dish = item.dishes[0]

    if (index === 0) styleTouchableOpacity = styles.firstImage
    else if (index === menuLength) styleTouchableOpacity = styles.lastImage

    return (
        <TouchableOpacity
            style={{...styleTouchableOpacity, ...styles.touchableOpacityContainer}}
            onPress={() => handleSetSectionProps(index)}
        >
            <BackgroundImage
                style={styles.touchableOpacityContainer}
                source={appImages.dishStub}
                resizeMode={'cover'}
            >
                <Image
                    style={styles.touchableOpacityContainer}
                    uri={dish.picture}
                    resizeMode={'cover'}
                />
            </BackgroundImage>
            <View
                style={bottomImageTitleStyle.viewText}
            >
                <Text
                    style={bottomImageTitleStyle.textStyle}
                >
                    {item.name}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    flatList: {
        position: 'absolute',
        left: -1 * defaultPageHorizontalSafeArea,
        top: 20
    },
    touchableOpacityContainer: {
        borderRadius: borderRadius.small,
        width: 100,
        height: 70
    },
    firstImage: {
        marginLeft: defaultPageHorizontalSafeArea
    },
    lastImage: {
        marginLeft: 7,
        marginRight: defaultPageHorizontalSafeArea
    },
    restImage: {
        marginLeft: 7
    },
})