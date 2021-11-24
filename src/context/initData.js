import React, {createContext, useContext, useMemo, useReducer} from "react";

const InitDataContext = createContext()

export const defaultInitData = null
const types = {
    setInitData: 'SET_INIT_DATA',
    setInitDataStatus: 'SET_INIT_DATA_STATUS'
}
export const initDataStatusTypes = {
    DOWNLOADED: 'DOWNLOADED',
    NOT_DOWNLOADED: 'NOT_DOWNLOADED'
}
const initState = {
    initData: defaultInitData,
    status: initDataStatusTypes.NOT_DOWNLOADED
}

function reducer (state, action) {
    switch (action.type) {
        case types.setInitData:
            return {...state, initData: action.payload.initData, status: action.payload.status}
        case types.setInitDataStatus:
            return {...state, status: action.payload.status}
        default:
            return state
    }
}

export function useInitDataContext() {
    const context = useContext(InitDataContext)
    if (!context) throw new Error(`useInitDataContext must be within InitDataContextProvider`)
    return context
}

export function InitDataContextProvider(props) {
    const [state, dispatch] = useReducer(reducer, initState)
    const returnInitDataContextState = () => [state, dispatch]
    const value = useMemo(returnInitDataContextState, [state])

    return (
        <InitDataContext.Provider value={value} {...props}/>
    )
}

export function setInitData(dispatch, initData, status) {
    dispatch({
        type: types.setInitData,
        payload: {
            initData: initData,
            status: status
        }
    })
}

export function setInitDataStatus(dispatch, status) {
    dispatch({
        type: types.setInitDataStatus,
        payload: {
            status: status
        }
    })
}