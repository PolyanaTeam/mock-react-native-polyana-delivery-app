import React, {createContext, useContext, useMemo, useReducer} from "react";

const PersonalInfoContext = createContext()

export const personalInfoStatusType = {
    notDownload: 'notDownload',
    notSignIn: 'notSignIn',
    downloading: 'downloading',
    signIn: 'signIn'
}

export const defaultPersonalInfo = null
export const defaultJsession = null
export const defaultOrdersHistory = null

const iniState = {
    status: personalInfoStatusType.notDownload,
    personalInfo: defaultPersonalInfo,
    jsession: defaultJsession,
    ordersHistory: defaultOrdersHistory
}

const types = {
    SET_PERSONAL_INFO: 'SET_PERSONAL_INFO',
    SET_PERSONAL_INFO_STATUS: 'SET_PERSONAL_INFO_STATUS',
    SET_PERSONAL_INFO_FROM_SERVER: 'SET_PERSONAL_INFO_FROM_SERVER'
}

function reducer(state, action) {
    switch (action.type) {
        case types.SET_PERSONAL_INFO:
            return {...state, personalInfo: action.payload.personalInfo}
        case types.SET_PERSONAL_INFO_STATUS:
            return {...state, status: action.payload.status}
        case types.SET_PERSONAL_INFO_FROM_SERVER:
            return {
                ...state,
                personalInfo: action.payload.personalInfo,
                status: action.payload.status,
                jsession: action.payload.jsession,
                ordersHistory: action.payload.ordersHistory
            }
        default:
            return state
    }
}

export function usePersonalInfoContext () {
    const context = useContext(PersonalInfoContext)
    if (!context) throw new Error(`usePersonalInfoContext must be within PersonalInfoContextProvider`)
    return context
}

export function PersonalInfoContextProvider(props) {
    const [state, dispatch] = useReducer(reducer, iniState)
    const returnPersonalInfoContextState = () => [state, dispatch]
    const value = useMemo(returnPersonalInfoContextState, [state])

    return (
        <PersonalInfoContext.Provider value={value} {...props}/>
    )
}

export function setPersonalInfo(dispatch, personalInfo) {
    dispatch({
        type: types.SET_PERSONAL_INFO,
        payload: {
            personalInfo: personalInfo
        }
    })
}

export function setPersonalInfoStatus(dispatch, status) {
    dispatch({
        type: types.SET_PERSONAL_INFO_STATUS,
        payload: {
            status: status
        }
    })
}

export function setPersonalInfoFromServer(dispatch, personalInfo, status, jsession, ordersHistory = defaultOrdersHistory) {
    dispatch({
        type: types.SET_PERSONAL_INFO_FROM_SERVER,
        payload: {
            personalInfo: personalInfo,
            status: status,
            jsession: jsession,
            ordersHistory: ordersHistory
        }
    })
}