import React, {useState} from "react";
import {View, StyleSheet} from 'react-native'
import {PageSafeArea} from "../generics/PageSafeArea";
import {DefaultHeader} from "../generics/DefaultHeader";
import {fontSize} from "../../config/styleConf";
import {HeaderBackButton} from "../generics/HeaderBackButton";
import {useNavigation} from "@react-navigation/native";
import {PageHorizontalSafeArea} from "../generics/PageHorizontalSafeArea";
import {Input} from "../generics/Input";
import {DefaultButton} from "../generics/DefaultButton";
import {IAgreePolicyComponent} from "../generics/IAgreePolicyComponent";
import {routeNameConfig} from "../../config/routeNamesConfig";
import {InformComponent} from "../generics/InformComponent";
import {usePersonalInfoContext} from "../../context/personalInfo";
import {checkLengthPhone, handlePhone, testPhoneIsValid} from "../../functions/textFunctions";
import {showOverlay, useOverlayContext} from "../../context/overlay";
import {getPayloadErrorText, makeApiRequest} from "../../functions/requestToApi";
import {appVariable} from "../../config/variableConf";
import {getPhoneKeyboardType} from "../../functions/inputFunctons";

export const Authorization1Page = ({route}) => {

    const successRoute = route.params?.params?.route
    const [{personalInfo}] = usePersonalInfoContext()
    const navigation = useNavigation()
    let jsx = !personalInfo ?
        <SignInComponent navigation={navigation} successRoute={successRoute}/>
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
                style={{flex: 1}}
            >
                {jsx}
            </PageHorizontalSafeArea>
        </PageSafeArea>
    )
}

const SignInComponent = ({navigation, successRoute}) => {

    const [phone, setPhone] = useState('+7')
    const [{}, dispatchOverlay] = useOverlayContext()
    const [isLoading, setIsLoading] = useState(false)

    return (
        <View
            style={{...styles.container, ...styles.SignInContainer}}
        >
            <View
                style={styles.contentView}
            >
                <Input
                    containerStyle={styles.inputContainer}
                    textStyle={styles.inputText}
                    placeholder={'Ваш телефон'}
                    value={phone}
                    text={'Номер телефона:'}
                    keyboardType={getPhoneKeyboardType()}
                    onChangeText={value => checkLengthPhone(value, setPhone)}
                />
                <DefaultButton
                    onPress={onPressButton}
                    title={'Отправить код'}
                    containerStyle={styles.buttonContainer}
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

        let handledPhone = handlePhone(phone)

        if (testPhoneIsValid(handledPhone)) {
            sendPhoneToServer(handledPhone, dispatchOverlay, navigation, setIsLoading, successRoute)
        } else {
            showOverlay(dispatchOverlay, 'Введён некорректный телефон')
        }
    }
}

async function sendPhoneToServer (phone, dispatchOverlay, navigation, setIsLoading, successRoute) {

    let isSuccess = false
    const handleNetworkError = (errorText) => showOverlay(dispatchOverlay, errorText)
    const handleSuccess = () => {
        isSuccess = true
        navigation.navigate(routeNameConfig.appRoute.authorization2, {params: {phone: phone, route: successRoute}})
    }
    const handleError = (payload) => showOverlay(dispatchOverlay, getPayloadErrorText(payload))

    setIsLoading(true)

    await makeApiRequest(appVariable.logInUrl,{phone: phone}, handleNetworkError, handleSuccess, handleError)

    if (!isSuccess) setIsLoading(false)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20
    },
    SignInContainer: {
        justifyContent: 'space-between'
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