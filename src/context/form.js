import React, {createContext, useContext, useMemo, useReducer} from "react";
import {appVariable} from "../config/variableConf";

const FormContext = createContext()

const types = {
    SET_FORM: 'SET_FORM',
    SET_FORM_COMBINE: 'SET_FORM_COMBINE'
}
export const formKeys = {
    deliveryType: 'deliveryType',
    name: 'name',
    phone: 'phone',
    paymentTypeId: 'paymentTypeId',
    addressObj: 'addressObj',
    flat: 'flat',
    entrance: 'entrance',
    floor: 'floor',
    doorphone: 'doorphone',
    terminalID: 'terminalID',
    personsCount: 'personsCount',
    comment: 'comment',
    promo: 'promo',
    checkFormServerAnswer: 'checkFormServerAnswer',
    bonuses: 'bonuses',
    isCallback: 'isCallback'
}

export const defaultCheckFormServerAnswer = null
export const defaultAddressObj = null

const initState = {}
initState[formKeys.deliveryType] = appVariable.deliveryTypes.delivery
initState[formKeys.name] = ''
initState[formKeys.phone] = '+7'
initState[formKeys.paymentTypeId] = ''
initState[formKeys.addressObj] = defaultAddressObj
initState[formKeys.flat] = ''
initState[formKeys.entrance] = ''
initState[formKeys.floor] = ''
initState[formKeys.doorphone] = ''
initState[formKeys.terminalID] = ''
initState[formKeys.personsCount] = ''
initState[formKeys.comment] = ''
initState[formKeys.promo] = ''
initState[formKeys.checkFormServerAnswer] = defaultCheckFormServerAnswer
initState[formKeys.bonuses] = 0
initState[formKeys.isCallback] = true

function reducer(state, action) {
    switch (action.type) {
        case types.SET_FORM:
            const obj = {...state}
            obj[action.payload.name] = action.payload.value
            return obj
        case types.SET_FORM_COMBINE:
            return returnCombineFormObj(state, action.payload.array)
        default:
            return state
    }
}

export function useFormContext () {
    const context = useContext(FormContext)
    if (!context) throw new Error('useFormContext must be within FormContextProvider')
    return context
}

export function FormContextProvider(props) {
    const [state, dispatch] = useReducer(reducer, initState)
    const returnFormContextState = () => [state, dispatch]
    const value = useMemo(returnFormContextState, [state])

    return (
        <FormContext.Provider value={value} {...props}/>
    )
}

export function setForm(dispatch, name, value) {
    dispatch({
        type: types.SET_FORM,
        payload: {
            name: name,
            value: value
        }
    })
}

export function setFormCombine(dispatch, array) {
    dispatch({
        type: types.SET_FORM_COMBINE,
        payload: {
            array: array
        }
    })
}

function returnCombineFormObj(state, array) {
    const obj = {...state}
    const func = (v) => obj[v.name] = v.value

    array.forEach(func)

    return obj
}