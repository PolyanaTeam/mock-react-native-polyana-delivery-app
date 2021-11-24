import React, {useState} from "react";
import {View, StyleSheet, Text} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {DefaultHeader} from "../generics/DefaultHeader";
import {HeaderBackButton} from "../generics/HeaderBackButton";
import {PageSafeArea} from "../generics/PageSafeArea";
import {borderRadius, colors, fontSize} from "../../config/styleConf";
import {PageHorizontalSafeArea} from "../generics/PageHorizontalSafeArea";
import {Input} from "../generics/Input";
import {DefaultButton} from "../generics/DefaultButton";
import {IAgreePolicyComponent} from "../generics/IAgreePolicyComponent";
import {routeNameConfig} from "../../config/routeNamesConfig";
import {InformComponent} from "../generics/InformComponent";
import {usePersonalInfoContext} from "../../context/personalInfo";
import {showOverlay, useOverlayContext} from "../../context/overlay";
import {getPayloadErrorText, makeApiRequest} from "../../functions/requestToApi";
import {appVariable} from "../../config/variableConf";
import {handlePersonalData} from "../../functions/accauntFunctions";
import {useFormContext} from "../../context/form";

export const Authorization2Page = ({route}) => {

    const [{personalInfo}] = usePersonalInfoContext()
    const navigation = useNavigation()
    let jsx = !personalInfo ?
        <SignInComponent
            route={route}
            navigation={navigation}
        />
        :
        <InformComponent
            containerStyle={styles.container}
            continuePath={routeNameConfig.appRoute.mapPage}
        />

    return (
        <PageSafeArea>
            <DefaultHeader>
                <HeaderBackButton
                    navigation={navigation}
                />
            </DefaultHeader>
            <PageHorizontalSafeArea
                style={styles.container}
            >
                {jsx}
            </PageHorizontalSafeArea>
        </PageSafeArea>
    )
}

const SignInComponent = ({route, navigation}) => {

    const phoneFromRoute = route.params.params?.phone
    const successRoute = route.params.params?.route
    const phone = phoneFromRoute ? phoneFromRoute : ''
    const [{}, dispatchOverlay] = useOverlayContext()
    const [code, setCode] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [{}, dispatchPersonalInfo] = usePersonalInfoContext()
    const [{}, dispatchForm] = useFormContext()

    return (
        <View
            style={styles.SignInContainer}
        >
            <View
                style={styles.contentView}
            >
                <View
                    style={styles.containerPhone}
                >
                    <Text
                        style={styles.phoneText}
                    >
                        Отправили код на
                    </Text>
                    <Text
                        style={{...styles.phoneText, ...styles.colorPhoneText}}
                    >
                        {`  ${phone}`}
                    </Text>
                </View>
                <Input
                    containerStyle={styles.inputContainer}
                    textStyle={styles.inputText}
                    placeholder={'Код'}
                    value={code}
                    text={'Код из смс:'}
                    onChangeText={(value) => setCode(value)}
                />
                <DefaultButton
                    title={'Продолжить'}
                    containerStyle={styles.buttonContainer}
                    onPress={onPressButton}
                    loading={isLoading}
                />
            </View>
            <View
                style={styles.contentView}
            >
                <IAgreePolicyComponent/>
            </View>
        </View>
    )

    function onPressButton () {
        if (code) {
            sendCodeToServer(phone, code, dispatchOverlay, setIsLoading, navigation, dispatchPersonalInfo, dispatchForm, successRoute)
        } else {
            showOverlay(dispatchOverlay, 'Введите код')
        }
    }
}

async function sendCodeToServer (phone, code, dispatchOverlay, setIsLoading, navigation, dispatchPersonalInfo, dispatchForm, successRoute) {

    let isSuccess = false
    const body = {phone: phone, sms: code}
    const handleNetworkError = (errorText) => showOverlay(dispatchOverlay, errorText)
    const handleSuccess = (payload) => {
        isSuccess = true
        handlePersonalData(dispatchPersonalInfo, dispatchForm, payload)

        if (successRoute) {
            navigation.navigate(routeNameConfig.appRoute.mainPage, {
                screen: successRoute
            })
        } else {
            navigation.navigate(routeNameConfig.appRoute.mapPage)
        }
    }
    const handleError = (payload) => showOverlay(dispatchOverlay, getPayloadErrorText(payload))

    setIsLoading(true)

    await makeApiRequest(appVariable.verifyUrl, body, handleNetworkError, handleSuccess, handleError)

    if (!isSuccess) setIsLoading(false)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20
    },
    SignInContainer: {
        flex: 1,
        justifyContent: 'space-between'
    },
    containerPhone: {
        width: '100%',
        backgroundColor: colors.defaultColor4,
        padding: 5,
        borderRadius: borderRadius.medium,
        marginBottom: 10,
        flexDirection: 'row'
    },
    phoneText: {
        fontSize: fontSize.preMedium,
        fontWeight: 'bold',
    },
    colorPhoneText: {
        color: colors.defaultColor2
    },
    contentView: {
        alignItems: 'center'
    },
    inputText: {
        fontSize: fontSize.big,
        fontWeight: 'bold',
    },
    buttonContainer: {
        marginTop: 30,
        width: 250
    },
    inputContainer: {
        width: '100%'
    }
})