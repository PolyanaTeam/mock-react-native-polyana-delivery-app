import React, {useEffect, useState} from "react";
import {View, StyleSheet, ScrollView, Text, useWindowDimensions, ImageBackground} from "react-native";
import {useInitDataContext} from "../../../context/initData";
import {appVariable} from "../../../config/variableConf";
import {showOverlay, useOverlayContext} from "../../../context/overlay";
import {getPayloadErrorText, makeApiRequest} from "../../../functions/requestToApi";
import {borderRadius, colors, fontSize} from "../../../config/styleConf";
import Carousel from "react-native-snap-carousel";
import {Image} from "react-native-expo-image-cache";
import {addDish} from "../../../context/basket";
import {appImages} from "../../../config/images";
import {DefaultButton} from "../../generics/DefaultButton";
import {PageHorizontalSafeArea} from "../../generics/PageHorizontalSafeArea";

export const RecommendationSection = ({conceptIndex, basket, sum, dispatchBasket, setOverlayModifiersObj}) => {

    const [{}, dispatchOverlay] = useOverlayContext()
    const [{initData}] = useInitDataContext()
    const [recAndProm, setRecAndProm] = useState({
        recommendations: [],
        promotions: []
    })

    useEffect(() => {
        const body = getBodyRecommendations(initData, conceptIndex, basket, appVariable.siteName, sum)
        getRecommendations(body, dispatchOverlay).then(recAndProm => setRecAndProm(recAndProm))
    }, [])

    return (
        <View
            style={styles.view}
        >
            <PromotionsComponent
                promotions={recAndProm.promotions}
            />
            <RecommendationsCarousel
                recommendations={recAndProm.recommendations}
                dispatchBasket={dispatchBasket}
                setOverlayModifiersObj={setOverlayModifiersObj}
            />
        </View>
    )
}

const PromotionsComponent = ({promotions}) => {

    let jsx = <></>

    if (promotions.length > 0) {
        jsx =
            <PageHorizontalSafeArea>
                <ScrollView
                    style={styles.scrollView}
                    persistentScrollbar={true}
                >
                    {
                        promotions.map(returnPromoText)
                    }
                </ScrollView>
            </PageHorizontalSafeArea>
    }

    function returnPromoText(v, i) {
        return (
            <Text
                key={i}
                style={styles.promoText}
            >
                {v}
            </Text>
        )
    }

    return jsx
}

const RecommendationsCarousel = ({recommendations, dispatchBasket, setOverlayModifiersObj}) => {

    const dimension = useWindowDimensions()
    const blockWidth = dimension.width
    const itemWidth = dimension.width - 100

    let jsx = <></>

    if (recommendations.length > 0) {

        recommendations = getRecommendationForCarousel(recommendations)

        jsx =
            <View
                style={styles.recommendationView}
            >
                <Carousel
                    data={recommendations}
                    renderItem={getRenderItem}
                    layoutCardOffset={recommendations.length}
                    sliderWidth={blockWidth}
                    itemWidth={itemWidth}
                    vertical={false}
                />
            </View>
    }

    return jsx

    function getRenderItem ({item}) {

        return (
            <View style={styles.block}>
                <RecommendationItem
                    item={item}
                    itemWidth={itemWidth}
                    dispatchBasket={dispatchBasket}
                    setOverlayModifiersObj={setOverlayModifiersObj}
                />
            </View>
        )
    }
}


const RecommendationItem = ({item, itemWidth, dispatchBasket, setOverlayModifiersObj}) => {

    return (
        <View
            style={styles.recommendationItemView}
        >
            {
                item.recommendations.map(returnRecommendationItem)
            }
        </View>
    )

    function returnRecommendationItem(value) {
        return (
            <View
                key={value.id}
                style={{width: itemWidth/2, marginHorizontal: 5}}
            >
                <ImageBackground
                    source={appImages.dishStub}
                    style={styles.image}
                    resizeMode={"cover"}
                >
                    <Image
                        style={styles.image}
                        uri={value.picture}
                        resizeMode={"cover"}
                    />
                </ImageBackground>
                <View style={styles.textBlock}>
                    <Text
                        numberOfLines={1}
                        style={styles.text}>
                        {value.name}
                    </Text>
                </View>
                <DefaultButton
                    title={value.price + ' Р'}
                    onPress={onPress(value)}
                    titleStyle={styles.buttonTitle}
                    borderRadius={borderRadius.small}
                    isBorder={true}
                    style={styles.button}
                />
            </View>
        )
    }

    function onPress (dishObj) {
        return () => {
            if (!dishObj.modifiers.length) addDish(dispatchBasket, dishObj)
            else setOverlayModifiersObj({isShow: true, dish: dishObj})
        }
    }
}

function getRecommendationForCarousel (recommendations) {

    let array = []

    let currentArr = {recommendations: []}
    recommendations.forEach(handleRecommendationArray)

    function handleRecommendationArray (value, i) {
        currentArr.recommendations.push(value)
        if (i % 2 !== 0) {
            array.push(currentArr)
            currentArr = {recommendations: []}
        }
    }

    return array
}

async function getRecommendations(body, dispatchOverlay) {

    let responseJSON = {
        recommendations: [],
        promotions: []
    }

    const handleNetworkError = (text) => showOverlay(dispatchOverlay, text)
    const handleSuccess = (payload) => responseJSON = payload
    const handleError = (payload) => showOverlay(dispatchOverlay, getPayloadErrorText(payload))

    await makeApiRequest(appVariable.getRecommendationsUrl, body, handleNetworkError, handleSuccess, handleError)

    return responseJSON
}

function getBodyRecommendations(initData, conceptIndex, basket, name, sum) {
    let productIds = []
    basket.forEach(e => productIds.push(e.productId))

    return {
        site: name,
        conceptId: initData.concept[conceptIndex].id,
        productIds: productIds,
        sum: sum
    }
}

const styles = StyleSheet.create({
    view: {
        marginTop: 10
    },
    scrollView: {
        maxHeight: 70,
        marginBottom: 10
    },
    promoText: {
        color: 'grey',
        fontWeight: 'bold',
        fontSize: 12,
        marginBottom: 5
    },
    recommendationView: {
        height: 150
    },
    recommendationItemView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    block: {
        flex: 1
    },
    image: {
        flexGrow: 1,
        borderRadius: 10
    },
    textBlock: {
        flexBasis: 30,
        justifyContent: "center"
    },
    text: {
        fontSize: 15,
        textAlign: 'center'
    },
    buttonTitle: {
        color: 'grey',
        fontSize: fontSize.small
    },
    button: {
        backgroundColor: 'white'
    }
})