import React, {useState} from "react";
import {StyleSheet} from "react-native";
import {Input} from "../generics/Input";
import {PageHorizontalSafeArea} from "../generics/PageHorizontalSafeArea";
import {DefaultButton} from "../generics/DefaultButton";
import {setPersonalInfo, usePersonalInfoContext} from "../../context/personalInfo";
import {showOverlay, useOverlayContext} from "../../context/overlay";
import {getErrorTextIfServerNotAvailable, getPayloadErrorText, makeApiRequest} from "../../functions/requestToApi";
import {appVariable} from "../../config/variableConf";

export const PromocodePage = () => {

    const [promocode, setPromocode] = useState('')
    const [isLoadingPromocodeButton, setIsLoadingPromocodeButton] = useState(false)
    const [{jsession}, dispatchPersonalInfo] = usePersonalInfoContext()
    const [{}, dispatchOverlay] = useOverlayContext()

    return (
        <PageHorizontalSafeArea
            style={styles.view}
        >
            <Input
                value={promocode}
                onChangeText={text => setPromocode(text)}
                placeholder={'Промокод'}
            />
            <DefaultButton
                style={styles.section}
                title={'Применить'}
                loading={isLoadingPromocodeButton}
                onPress={() => {
                    onSubmit(
                        promocode,
                        setPromocode,
                        setIsLoadingPromocodeButton,
                        dispatchOverlay,
                        dispatchPersonalInfo,
                        jsession
                    )
                }}
            />
        </PageHorizontalSafeArea>
    )
}

async function onSubmit (
    promocode,
    setPromocode,
    setIsLoadingPromocodeButton,
    dispatchOverlay,
    dispatchPersonalInfo,
    jsession
) {

    if (promocode.length === 0) return

    const handleNetworkError = () => showOverlay(dispatchOverlay, getErrorTextIfServerNotAvailable())
    const handleSuccess = (payload) => {
        setPromocode('')
        setPersonalInfo(dispatchPersonalInfo, payload.PersonalInfo)
    }
    const handleError = (payload) => showOverlay(dispatchOverlay, getPayloadErrorText(payload))
    const body = {jsession: jsession, promocode: promocode}

    setIsLoadingPromocodeButton(true)

    await makeApiRequest(appVariable.usePromocodeUrl, body, handleNetworkError, handleSuccess, handleError)

    setIsLoadingPromocodeButton(false)
}

const styles = StyleSheet.create({
    view: {
        marginTop: 20
    },
    section: {
        marginTop: 20
    }
})