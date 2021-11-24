import React, {useState} from "react";
import {BasketPageContainer} from "../generics/BasketPageContainer";
import {useBasketContext} from "../../context/basket";
import {Text, View, StyleSheet} from "react-native";
import {fontSize} from "../../config/styleConf";
import {DishList} from "../modules/CheckBasketPage/DishList";
import {SumSection} from "../modules/CheckBasketPage/SumSection";
import {RecommendationSection} from "../modules/CheckBasketPage/RecommendationSection";
import {PageHorizontalSafeArea} from "../generics/PageHorizontalSafeArea";
import {DefaultButton} from "../generics/DefaultButton";
import {useNavigation} from "@react-navigation/native";
import {routeNameConfig} from "../../config/routeNamesConfig";
import {OverlayModifiers} from "../generics/OverlayModifiers";

export const CheckBasketPage = () => {

    const navigation = useNavigation()
    const [{basket, sum, basketConceptIndex}, dispatchBasket] = useBasketContext()
    const [overlayModifiersObj, setOverlayModifiersObj] = useState({isShow: false, dish: null})

    let jsx =
        <View
            style={styles.view}
        >
            <Text
                style={styles.text}
            >
                Ваша корзина пустая
            </Text>
        </View>

    if (sum > 0) {
        jsx =
            <>
                <PageHorizontalSafeArea
                    style={styles.viewSection}
                >
                    <DishList
                        basket={basket}
                        dispatchBasket={dispatchBasket}
                    />
                    <SumSection
                        sum={sum}
                    />
                </PageHorizontalSafeArea>
                <RecommendationSection
                    conceptIndex={basketConceptIndex}
                    basket={basket}
                    sum={sum}
                    dispatchBasket={dispatchBasket}
                    setOverlayModifiersObj={setOverlayModifiersObj}
                />
                <PageHorizontalSafeArea
                    style={styles.bottomButtonSection}
                >
                    <DefaultButton
                        title={'Далее'}
                        titleStyle={styles.bottomButtonTitle}
                        onPress={() => navigation.navigate(routeNameConfig.basketPage.form)}
                    />
                </PageHorizontalSafeArea>
                <OverlayModifiers
                    isVisible={overlayModifiersObj.isShow}
                    dish={overlayModifiersObj.dish}
                    hide={() => setOverlayModifiersObj({isShow: false, dish: null})}
                    basketConceptIndex={basketConceptIndex}
                    dispatchBasket={dispatchBasket}
                />
            </>
    }

    return (
        <BasketPageContainer isHorizontalSafeArea={false}>
            {jsx}
        </BasketPageContainer>
    )
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewSection: {
        flex: 1
    },
    text: {
        fontWeight: 'bold',
        fontSize: fontSize.medium,
        textAlign: 'center'
    },
    bottomButtonSection: {
        marginVertical: 10
    },
    bottomButtonTitle: {
        fontSize: fontSize.small
    }
})