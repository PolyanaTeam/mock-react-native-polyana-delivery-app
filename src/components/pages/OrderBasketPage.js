import React, {useState} from "react";
import {BasketPageContainer} from "../generics/BasketPageContainer";
import {Text, View, StyleSheet} from "react-native";
import {formKeys, setFormCombine, useFormContext} from "../../context/form";
import {fontSize} from "../../config/styleConf";
import {useNavigation} from "@react-navigation/native";
import {clearBasket, useBasketContext} from "../../context/basket";
import {useInitDataContext} from "../../context/initData";
import {usePersonalInfoContext} from "../../context/personalInfo";
import {showOverlay, useOverlayContext} from "../../context/overlay";
import {DefaultButton} from "../generics/DefaultButton";
import {OrderInfo} from "../modules/OrderBasketPage/OrderInfo";
import {getOrderBody} from "../../functions/orderFunction";
import {setCurrentBonuses} from "../../functions/accauntFunctions";
import {routeNameConfig} from "../../config/routeNamesConfig";
import {getErrorBonusesLack} from "../../functions/errorFunctions";
import {getPayloadErrorText, handlePayloadError, makeApiRequest} from "../../functions/requestToApi";
import {appVariable} from "../../config/variableConf";
import {openBrowserAsync} from "expo-web-browser";

export const OrderBasketPage = () => {

    const navigation = useNavigation()
    const [form, dispatchForm] = useFormContext()
    const [basket, dispatchBasket] = useBasketContext()
    const [{initData}] = useInitDataContext()
    const [{personalInfo, jsession}, dispatchPersonalInfo] = usePersonalInfoContext()
    const [{}, dispatchOverlay] = useOverlayContext()
    const [isLoading, setIsLoading] = useState(false)

    let jsx =
        <View
            style={styles.view}
        >
            <Text
                style={styles.text}
            >
                Заказ не был создан
            </Text>
        </View>

    if (form.checkFormServerAnswer && basket.sum > 0) {
        jsx =
            <>
                <OrderInfo
                    checkFormServerAnswer={form.checkFormServerAnswer}
                />
                <DefaultButton
                    title={'Заказать'}
                    containerStyle={styles.buttonContainer}
                    onPress={ () => {
                        pressOrderButton({
                            form: form,
                            basket: basket,
                            initData: initData,
                            jsession: jsession,
                            dispatchOverlay: dispatchOverlay,
                            dispatchBasket: dispatchBasket,
                            dispatchForm: dispatchForm,
                            dispatchPersonalInfo: dispatchPersonalInfo,
                            personalInfo: personalInfo,
                            navigation: navigation,
                            setIsLoading: setIsLoading
                        })
                    }}
                    loading={isLoading}
                />
            </>
    }

    return (
        <BasketPageContainer>
            {jsx}
        </BasketPageContainer>
    )
}

async function pressOrderButton ({
    form,
    basket,
    initData,
    jsession,
    dispatchOverlay,
    dispatchBasket,
    dispatchForm,
    dispatchPersonalInfo,
    personalInfo,
    navigation,
    setIsLoading
}) {

    const body = getOrderBody({
        form: form,
        basket: basket,
        initData: initData,
        conceptIndex: basket.basketConceptIndex,
        jsession: jsession,
    })
    let isSuccess = false
    const handleNetworkError = (text) => showOverlay(dispatchOverlay, text)
    const handleSuccess = (payload) => {

        isSuccess = true
        let isOnlinePay = false
        const payUrl = payload.url_purchase
        const bonuses = payload.bonuses
        const redirectToPayPage = (url) => navigation.navigate(routeNameConfig.appRoute.payPage, {params: {src: url}})

        if (payUrl !== undefined) isOnlinePay = true

        clearBasket(dispatchBasket)
        setFormCombine(dispatchForm, [
            {name: formKeys.comment, value: ''},
            {name: formKeys.promo, value: ''},
            {name: formKeys.bonuses, value: 0}
        ])

        bonuses !== null && setCurrentBonuses(dispatchPersonalInfo, personalInfo, payload.bonuses)

        if (isOnlinePay) {
            if (appVariable.isIOS) {
                openBrowserAsync(payUrl)
                    .then(() => navigation.navigate(routeNameConfig.appRoute.mainPage))
                    .catch(() => redirectToPayPage(payUrl))
            }
            else redirectToPayPage(payUrl)
        }
        else {
            showOverlay(dispatchOverlay, 'Спасибо за заказ. Дождитесь звонка оператора')
            navigation.navigate(routeNameConfig.appRoute.mainPage)
        }
    }
    const handleError = (payload) => {
        const bonusesLackErrorObj = getErrorBonusesLack(dispatchOverlay, dispatchPersonalInfo, personalInfo)
        const errorArray = [
            bonusesLackErrorObj
        ]
        const defaultAction = (payload) => showOverlay(dispatchOverlay, getPayloadErrorText(payload))

        handlePayloadError(payload, errorArray, defaultAction)
    }

    setIsLoading(true)

    await makeApiRequest(appVariable.createOrderUrl, body, handleNetworkError, handleSuccess, handleError)

    if (!isSuccess) setIsLoading(false)
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        alignItems: 'center',
        fontSize: fontSize.preMedium
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        width: '100%'
    }
})