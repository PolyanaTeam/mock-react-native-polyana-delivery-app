import React, {useReducer, useState} from "react";
import {StyleSheet} from "react-native";
import {Input} from "../generics/Input";
import {setPersonalInfo, usePersonalInfoContext} from "../../context/personalInfo";
import {PageHorizontalSafeArea} from "../generics/PageHorizontalSafeArea";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {DateInput} from "../modules/ProfileInfoSettingsPage/DateInput";
import {DefaultButton} from "../generics/DefaultButton";
import {fontSize} from "../../config/styleConf";
import {showOverlay, useOverlayContext} from "../../context/overlay";
import {getPayloadErrorText, makeApiRequest} from "../../functions/requestToApi";
import {appVariable} from "../../config/variableConf";

const inputTypes = {name: 'name', email: 'email', birthday: 'birthday'}

function reducer (state, action) {
    switch (action.type) {
        case inputTypes.name:
            return {...state, name: action.payload}
        case inputTypes.email:
            return {...state, email: action.payload}
        case inputTypes.birthday:
            return {...state, birthday: action.payload}
        default:
            return state
    }
}

export const ProfileInfoSettingsPage = () => {

    const [{personalInfo, jsession}, dispatchPersonalInfo] = usePersonalInfoContext()
    const [{}, dispatchOverlay] = useOverlayContext()

    const initState = {}
    initState[inputTypes.name] = personalInfo.name
    initState[inputTypes.email] = personalInfo.email
    initState[inputTypes.birthday] = personalInfo.birthday

    const [state, dispatch] = useReducer(reducer, initState)
    const [isLoading, setIsLoading] = useState(false)
    const [isShowDate, setIsShowDate] = useState(false)

    return (
        <>
            <PageHorizontalSafeArea>
                <KeyboardAwareScrollView
                    style={styles.scrollView}
                    enableOnAndroid={true}
                    showsVerticalScrollIndicator={false}
                >
                    <Input
                        text={'Телефон'}
                        value={personalInfo.phone}
                        isDisabled={true}
                    />
                    <Input
                        containerStyle={styles.inputContainer}
                        text={'Имя'}
                        value={state.name}
                        onChangeText={(e) => onChange(e, inputTypes.name)}
                        isDisabled={isShowDate}
                    />
                    <Input
                        containerStyle={styles.inputContainer}
                        text={'Дата рождения'}
                        value={state.birthday}
                        onPress={() => setIsShowDate(true)}
                        isDisabled={!!state.birthday}
                    />
                    <Input
                        containerStyle={{...styles.inputContainer, paddingBottom: 150}}
                        text={'Почта для чеков оплаты'}
                        placeholder={'name@mail.ru'}
                        value={state.email}
                        onChangeText={(e) => onChange(e, inputTypes.email)}
                        isDisabled={isShowDate}
                    />
                </KeyboardAwareScrollView>
            </PageHorizontalSafeArea>
            <DefaultButton
                containerStyle={styles.buttonContainer}
                titleStyle={styles.buttonTitle}
                style={styles.button}
                title={'Сохранить'}
                loading={isLoading}
                onPress={() => onSubmit(state, jsession, personalInfo, dispatchOverlay, dispatchPersonalInfo, setIsLoading)}
            />
            {
                isShowDate ?
                    <DateInput
                        birthday={state.birthday}
                        setIsShowDate={setIsShowDate}
                        onChange={onChange}
                        inputTypes={inputTypes}
                    />
                    :
                    null
            }
        </>
    )

    function onChange (e, inputType) {
        dispatch({type: inputType, payload: e})
    }
}

async function onSubmit (state, jsession, personalInfo, dispatchOverlay, dispatchPersonalInfo, setIsLoading) {

    const stateKeys = Object.keys(state)
    const changedKeys = []
    const body = {jsession: jsession}

    stateKeys.forEach(v => state[v] !== personalInfo[v] && changedKeys.push(v))

    if (changedKeys.length <= 0) return
    changedKeys.forEach(v => body[v] = state[v])

    const handleNetworkError = (errorText) => showOverlay(dispatchOverlay, errorText)
    const handleSuccess = (payload) => {
        showOverlay(dispatchOverlay, 'Данные изменены')
        setPersonalInfo(dispatchPersonalInfo, payload.PersonalInfo)
    }
    const handleError = (payload) => showOverlay(dispatchOverlay, getPayloadErrorText(payload))

    setIsLoading(true)
    await makeApiRequest(appVariable.updateProfileSettingsUrl, body, handleNetworkError, handleSuccess, handleError)
    setIsLoading(false)
}

const styles = StyleSheet.create({
    scrollView: {
        paddingTop: 20
    },
    inputContainer: {
        marginTop: 20
    },
    button: {
        marginHorizontal: 20
    },
    buttonTitle: {
        fontSize: fontSize.preMedium
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 15,
        width: '100%'
    }
})