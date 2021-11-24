import React, {useEffect, useRef} from "react";
import {FlatList, Text, TouchableOpacity, StyleSheet, View} from "react-native";
import {useInitDataContext} from "../../context/initData";
import {appImages} from "../../config/images";
import {Image} from "react-native-expo-image-cache";
import {BackgroundImage} from "react-native-elements/dist/config";
import {fontSize} from "../../config/styleConf";
import hexRgb from "hex-rgb";
import {returnRgba} from "../../functions/colorFunctions";
import {bottomImageTitle} from "../../styles/bottomImageTitle";
import {useNavigation} from "@react-navigation/native";
import {routeNameConfig} from "../../config/routeNamesConfig";

export const CategoriesPage = ({route}) => {

    const navigation = useNavigation()
    const [{initData}] = useInitDataContext()
    const conceptIndexFromRoute = route?.params?.conceptIndex
    const conceptIndex = conceptIndexFromRoute ? conceptIndexFromRoute : 0
    const conceptObj = initData.concept[conceptIndex]

    return (
        <Section
            conceptObj={conceptObj}
            navigation={navigation}
            conceptIndex={conceptIndex}
        />
    )
}

const Section = ({conceptObj, navigation, conceptIndex}) => {

    const ref = useRef(null)
    const hexPrimaryColor = hexRgb(conceptObj.PrimaryColor)
    const rgbaPrimaryColor = returnRgba(hexPrimaryColor.red, hexPrimaryColor.green, hexPrimaryColor.blue, 0.6)
    const bottomImageTitleStyle = bottomImageTitle(
        '100%', rgbaPrimaryColor,
        0, 0, fontSize.preMedium, 0
    )
    const menu = conceptObj.menu

    useEffect(() => {
        if (ref) ref.current.scrollToOffset({animated: false, offset: 0})
    }, [conceptObj])

    return (
        <FlatList
            ref={ref}
            style={styles.view}
            data={menu}
            keyExtractor={item => item.id + item.order}
            initialNumToRender={6}
            maxToRenderPerBatch={2}
            showsVerticalScrollIndicator={false}
            renderItem={handleRenderItem(bottomImageTitleStyle, menu, navigation, conceptIndex)}
        />
    )
}

function handleRenderItem(bottomImageTitleStyle, menu, navigation, conceptIndex) {

    let isOut = false

    const action = (categoryIndex) => {
        return () => {
            navigation.navigate(routeNameConfig.mainPage.menu, {
                screen: routeNameConfig.menuPage.dishes,
                params: {
                    conceptIndex: conceptIndex,
                    categoryIndex: categoryIndex
                }
            })
        }
    }

    return ({item, index}) => {
        if (index % 3 === 0) {
            isOut = false
            return (
                <Category
                    item={item}
                    bottomImageTitleStyle={bottomImageTitleStyle}
                    action={action(index)}
                />
            )
        }
        else if (isOut) {
            return null
        }

        isOut = true

        return (
            <View
                style={styles.doubleDishView}
            >
                <Category
                    item={item}
                    bottomImageTitleStyle={bottomImageTitleStyle}
                    style={{marginRight: 2}}
                    action={action(index)}
                />
                <Category
                    item={menu[index+1]}
                    bottomImageTitleStyle={bottomImageTitleStyle}
                    style={{marginLeft: 2}}
                    action={action(index+1)}
                />
            </View>
        )
    }
}

const Category = ({item, bottomImageTitleStyle, style = {}, action}) => {

    if (!item) return null

    return (
        <TouchableOpacity
            style={{...styles.dishView, ...style}}
            onPress={action}
        >
            <BackgroundImage
                style={styles.backgroundImage}
                source={appImages.dishStub}
                resizeMode={"cover"}
            >
                <Image
                    style={styles.image}
                    uri={item.dishes[0].picture}
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
    view: {
        marginTop: 20
    },
    doubleDishView: {
        flexDirection: 'row',
        height: 150,
        width: '100%',
        marginBottom: 5
    },
    dishView: {
        flex: 1,
        height: 150,
        marginBottom: 5,
    },
    image: {
        width: '100%',
        height: 150
    },
    backgroundImage: {
        height: 150,
        width: '100%'
    },
})