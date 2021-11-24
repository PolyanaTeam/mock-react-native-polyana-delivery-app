import React, {forwardRef, useMemo, useRef, useState} from "react";
import {PageHorizontalSafeArea} from "../generics/PageHorizontalSafeArea";
import {Text, StyleSheet, FlatList, View} from "react-native";
import {useInitDataContext} from "../../context/initData";
import {Image} from "react-native-expo-image-cache";
import {borderRadius, fontSize} from "../../config/styleConf";
import {DefaultButton} from "../generics/DefaultButton";
import {PromotionBottomSheet} from "../modules/PromotionsPage/PromotionBottomSheet";
import {useNavigation} from "@react-navigation/native";
import {routeNameConfig} from "../../config/routeNamesConfig";
import {handlePromotionButtonWant} from "../../functions/promotionsFunction";

const viewHeight = 280

export const PromotionsPage = () => {

    const navigation = useNavigation()
    const [{initData}] = useInitDataContext()
    const bottomSheetRef = useRef(null)
    const promotions = useMemo(() => getPromotions(initData), [])
    const [promotionObj , setPromotionObj] = useState({promotionObj: promotions[0].promotion, conceptIndex: 0})

    return (
        <>
            <PageHorizontalSafeArea
                style={{flex: 1}}
            >
                <PromotionsSection
                    promotions={promotions}
                    ref={bottomSheetRef}
                    setPromotionObj={setPromotionObj}
                    navigateToDishPage={navigateToDishPage}
                    initData={initData}
                    navigation={navigation}
                />
            </PageHorizontalSafeArea>
            <PromotionBottomSheet
                ref={bottomSheetRef}
                promotionObj={promotionObj.promotionObj}
                pressWantButtonBottomSheet={pressWantButtonBottomSheet}
            />
        </>
    )

    function pressWantButtonBottomSheet () {
        handlePromotionButtonWant(
            promotionObj.promotionObj,
            promotionObj.conceptIndex,
            navigateToDishPage,
            initData.concept[promotionObj.conceptIndex],
            navigation
        )
    }

    function navigateToDishPage ({
        conceptIndex  = null,
        categoryIndex = null,
        tagName = null,
        dishIndex = null,
        dishCategoryIndex = null,
    }) {
        navigation.navigate(routeNameConfig.mainPage.menu, {
            screen: routeNameConfig.menuPage.dishes,
            params: {
                conceptIndex: conceptIndex,
                categoryIndex: categoryIndex,
                tagName: tagName,
                dishIndex: dishIndex,
                dishCategoryIndex: dishCategoryIndex
            }
        })
    }
}

const PromotionsSection = forwardRef((props, bottomSheetRef) => {

    const {promotions, setPromotionObj, navigateToDishPage, initData, navigation} = props
    const numColumns = 1

    return (
        <FlatList
            style={styles.flatList}
            data={promotions}
            keyExtractor={item => item.promotion.id}
            numColumns={numColumns}
            initialNumToRender={6}
            maxToRenderPerBatch={4}
            showsVerticalScrollIndicator={false}
            getItemLayout={
                (data, index) => (
                    { index, length: viewHeight, offset: viewHeight * index })
            }
            renderItem={({item}) => {
                return (
                    <Promotion
                        promotionObj={item.promotion}
                        showBottomSheet={showBottomSheet}
                        setPromotionObj={setPromotionObj}
                        navigateToDishPage={navigateToDishPage}
                        conceptObj={initData.concept[item.conceptIndex]}
                        conceptIndex={item.conceptIndex}
                        navigation={navigation}
                    />
                )
            }}
        />
    )

    function showBottomSheet () {
        if (bottomSheetRef) bottomSheetRef.current.snapTo(0)
    }
})

const Promotion = ({promotionObj, showBottomSheet, setPromotionObj, navigateToDishPage, conceptObj, conceptIndex, navigation}) => {

    return (
        <View
            style={styles.view}
        >
            <Image
                style={styles.image}
                uri={promotionObj.imageLink}
                resizeMode={'cover'}
            />
            <Text
                style={styles.name}
                numberOfLines={1}
            >
                {promotionObj.name}
            </Text>
            <Text
                style={styles.description}
                numberOfLines={2}
            >
                {promotionObj.description}
            </Text>
            <View
                style={styles.buttonSection}
            >
                <DefaultButton
                    style={styles.buttonStyle}
                    titleStyle={styles.buttonTitle}
                    title={'Хочу'}
                    onPress={() => handlePromotionButtonWant(promotionObj, conceptIndex, navigateToDishPage, conceptObj, navigation)}
                />
                <DefaultButton
                    style={{...styles.buttonStyle, backgroundColor: 'white'}}
                    titleStyle={{...styles.buttonTitle, color: 'grey'}}
                    title={'Подробнее'}
                    isBorder={true}
                    onPress={ () => {
                        setPromotionObj({promotionObj: promotionObj, conceptIndex: conceptIndex});
                        showBottomSheet();
                    }}
                />
            </View>
        </View>
    )
}

function getPromotions (initData) {
    const promotions = []
    const promotionsIdArray = []

    initData.concept.forEach((concept, conceptIndex) => {
        concept.promotions.forEach(promotion => {
            const promotionId = promotion.id

            if (!promotionsIdArray.includes(promotionId)) {
                promotions.push({promotion: promotion, conceptIndex: conceptIndex})
                promotionsIdArray.push(promotionId)
            }
        })
    })

    return promotions
}

const styles = StyleSheet.create({
    flatList: {
        marginTop: 10
    },
    view: {
        borderRadius: borderRadius.small,
        height: 250,
        marginBottom: 30,
    },
    image: {
        borderTopLeftRadius: borderRadius.small,
        borderTopRightRadius: borderRadius.small,
        height: 100
    },
    name: {
        fontSize: fontSize.small,
        fontWeight: 'bold',
        marginVertical: 5
    },
    description: {
        color: 'grey',
        fontSize: fontSize.small
    },
    buttonSection: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    buttonStyle: {
        width: 120
    },
    buttonTitle: {
        fontSize: fontSize.small
    }
})