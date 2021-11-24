import React from "react";
import {FlatList, StyleSheet, TouchableOpacity, Image as ImageRN, View, Text} from "react-native";
import {useInitDataContext} from "../../../context/initData";
import {Image} from "react-native-expo-image-cache";
import {borderRadius, colors} from "../../../config/styleConf";
import {LinearGradient} from "expo-linear-gradient";
import hexRgb from "hex-rgb";
import {appImages} from "../../../config/images";
import {useNavigation} from "@react-navigation/native";
import {routeNameConfig} from "../../../config/routeNamesConfig";
import {returnRgba} from "../../../functions/colorFunctions";

export const RestaurantsGrid = () => {

    const numColumns = 1
    const [{initData}] = useInitDataContext()
    const concept = initData.concept
    const navigation = useNavigation()

    return (
        <FlatList
            style={styles.flatList}
            data={initData.BannerStart}
            keyExtractor={item => item.conceptId}
            numColumns={numColumns}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) => {
                return (
                    <Banner item={item} index={index} concept={concept} navigation={navigation}/>
                )
            }}
        />
    )
}

const Banner = ({item, index, concept, navigation}) => {

    const conceptObj = concept[index]
    const primaryColor = conceptObj.SecondaryColor
    const hex = hexRgb(primaryColor)
    const red = hex.red
    const green = hex.green
    const blue = hex.blue

    if (conceptObj.stop) return null

    return (
        <TouchableOpacity
            style={{...styles.touchableView, ...styles.image}}
            onPress={() => {
                navigation.navigate(routeNameConfig.mainPage.menu, {
                    screen: routeNameConfig.menuPage.categories,
                    params: {conceptIndex: index}
                })
            }}
        >
            <Image
                style={styles.image}
                uri={item.bannerURL}
                resizeMode={'cover'}
            />
            <LinearGradient
                colors={[returnRgba(red, green, blue, 0), returnRgba(red, green, blue, 0.5), primaryColor]}
                style={styles.absoluteView}
            >
                <Image
                    uri={conceptObj.logo}
                    style={styles.logo}
                    resizeMode={'contain'}/>
                <RestLabelView
                    conceptObj={conceptObj}
                />
            </LinearGradient>
        </TouchableOpacity>
    )
}

const RestLabelView = ({conceptObj}) => {

    return (
        <View
            style={styles.restLabelView}
        >
            <View
                style={styles.labelView}
            >
                <ImageRN
                    source={appImages.clock}
                    resizeMode={'contain'}
                    style={styles.labelImage}
                />
                <Text
                    style={styles.labelText}
                >
                    {`${conceptObj.OperationTimeStart.Desc}\n${conceptObj.OperationTimeEnd.Desc}`}
                </Text>
            </View>
            <View
                style={styles.labelView}
            >
                <ImageRN
                    source={appImages.courier}
                    resizeMode={'contain'}
                    style={styles.labelImage}
                />
                <Text
                    style={{...styles.labelText, ...styles.deliveryTime}}
                >
                    {conceptObj.DefaultDeliveryTime}
                </Text>
            </View>
            <View
                style={styles.labelView}
            >
                <ImageRN
                    source={appImages.receipt}
                    resizeMode={'contain'}
                    style={styles.labelImage}
                />
                <View
                    style={styles.rubleView}
                >
                    <ImageRN
                        source={appImages.ruble}
                        resizeMode={'contain'}
                        style={styles.rubleImage}
                    />
                    <ImageRN
                        source={appImages.ruble}
                        resizeMode={'contain'}
                        style={styles.rubleImage}
                        opacity={conceptObj.DefaultBillIndex >= 2 ? 1 : 0.5}
                    />
                    <ImageRN
                        source={appImages.ruble}
                        resizeMode={'contain'}
                        style={styles.rubleImage}
                        opacity={conceptObj.DefaultBillIndex === 3 ? 1 : 0.5}
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    flatList: {
        marginTop: 10,
    },
    touchableView: {
        backgroundColor: colors.defaultColor4,
        marginBottom: 15
    },
    image: {
        borderRadius: borderRadius.medium,
        width: '100%',
        height: 160
    },
    absoluteView: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        height: 70,
        borderRadius: borderRadius.medium,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    logo: {
        height: 40,
        width: 60
    },
    restLabelView: {
        flexDirection: 'row'
    },
    labelView: {
        marginLeft: 5,
        paddingLeft: 5,
        height: 35,
        width: 70,
        borderRadius: borderRadius.medium,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
    },
    labelImage: {
        width: 25,
        height: 25
    },
    labelText: {
        textAlign: 'center',
        width: 35,
        fontSize: 10,
        fontWeight: 'bold'
    },
    rubleView: {
        marginLeft: 3,
        flexDirection: 'row'
    },
    rubleImage: {
        width: 10,
        height: 10
    },
    deliveryTime: {
        paddingHorizontal: 5
    }
})