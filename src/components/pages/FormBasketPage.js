import React, {useState} from "react";
import {BasketPageContainer} from "../generics/BasketPageContainer";
import {StyleSheet, Text, View} from "react-native";
import {defaultCheckFormServerAnswer, formKeys, setForm, useFormContext} from "../../context/form";
import {useInitDataContext} from "../../context/initData";
import {defaultBasketConceptIndex, useBasketContext} from "../../context/basket";
import {useNavigation} from "@react-navigation/native";
import {DefaultButton} from "../generics/DefaultButton";
import {fontSize} from "../../config/styleConf";
import {usePersonalInfoContext} from "../../context/personalInfo";
import {showOverlay, useOverlayContext} from "../../context/overlay";
import {Form} from "../modules/FormBasketPage/Form";
import {checkOrder} from "../../functions/checkOrderFunctions";
import {routeNameConfig} from "../../config/routeNamesConfig";
import {getPayloadErrorText, handlePayloadError, makeApiRequest} from "../../functions/requestToApi";
import {getErrorBonusesLack} from "../../functions/errorFunctions";
import {appVariable} from "../../config/variableConf";

export const FormBasketPage = () => {

    const [isLoading, setIsLoading] = useState(false)
    const navigation = useNavigation()
    const [form, dispatchForm] = useFormContext()
    const [{initData}] = useInitDataContext()
    const [{basket, sum, basketConceptIndex}] = useBasketContext()
    const [{jsession, personalInfo}, dispatchPersonalInfo] = usePersonalInfoContext()
    const [{}, dispatchOverlay] = useOverlayContext()

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

    if (basketConceptIndex !== defaultBasketConceptIndex && sum) {
        jsx =
            <>
                <Form
                    form={form}
                    dispatchForm={dispatchForm}
                    navigation={navigation}
                    initData={initData}
                    basketConceptIndex={basketConceptIndex}
                />
                <DefaultButton
                    containerStyle={styles.buttonContainer}
                    titleStyle={styles.buttonTitle}
                    title={'Далее'}
                    loading={isLoading}
                    onPress={() => checkForm({
                        form: form,
                        basket: basket,
                        initData: initData,
                        basketConceptIndex: basketConceptIndex,
                        sum: sum,
                        jsession: jsession,
                        dispatchOverlay: dispatchOverlay,
                        personalInfo: personalInfo,
                        dispatchPersonalInfo: dispatchPersonalInfo,
                        dispatchForm: dispatchForm,
                        navigation: navigation,
                        setIsLoading: setIsLoading
                    })}
                />
            </>
    }

    return (
        <BasketPageContainer>
            {jsx}
        </BasketPageContainer>
    )
}

function checkForm ({
    form,
    basket,
    initData,
    basketConceptIndex,
    sum,
    jsession,
    dispatchOverlay,
    personalInfo,
    dispatchPersonalInfo,
    dispatchForm,
    navigation,
    setIsLoading
}) {

    const body = checkOrder({
        form: form,
        dishes: basket,
        id: initData.concept[basketConceptIndex].id,
        sum: sum,
        jsession: jsession
    })

    if (body.errorForm !== undefined) {
        showOverlay(dispatchOverlay, body.errorForm.text)
        return
    }

    checkFormInServer({
        body: body,
        dispatchForm: dispatchForm,
        dispatchOverlay: dispatchOverlay,
        navigation: navigation,
        dispatchPersonalInfo: dispatchPersonalInfo,
        personalInfo: personalInfo,
        setIsLoading: setIsLoading
    })
}

async function checkFormInServer ({
    body,
    dispatchForm,
    dispatchOverlay,
    navigation,
    dispatchPersonalInfo,
    personalInfo,
    setIsLoading
}) {

    let isSuccessRequest = false
    const setCheckFormServerAnswer = (value) => setForm(dispatchForm, formKeys.checkFormServerAnswer, value)
    let checkFormServerAnswerPayload = defaultCheckFormServerAnswer
    const handleNetworkError = (errorText) => showOverlay(dispatchOverlay, errorText)
    const handleSuccess = (payload) => {
        isSuccessRequest = true
        checkFormServerAnswerPayload = payload
        navigation.navigate(routeNameConfig.appRoute.basketPage, {screen: routeNameConfig.basketPage.order})
    }
    const handleError = (payload) => {

        const bonusesLackErrorObj = getErrorBonusesLack(dispatchOverlay, dispatchPersonalInfo, personalInfo)
        const errorArray = [bonusesLackErrorObj]
        const defaultAction = (payload) => showOverlay(dispatchOverlay, getPayloadErrorText(payload))

        handlePayloadError(payload, errorArray, defaultAction)
    }

    setIsLoading(true)
    await makeApiRequest(appVariable.checkOrderForm, body, handleNetworkError, handleSuccess, handleError)
    setCheckFormServerAnswer(checkFormServerAnswerPayload)
    setIsLoading(false)
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        textAlign: 'center',
        fontSize: fontSize.preMedium
    },
    buttonContainer: {
        position: 'absolute',
        width: '100%',
        height: 45,
        bottom: 10
    },
    buttonTitle: {
        fontSize: fontSize.small
    }
})