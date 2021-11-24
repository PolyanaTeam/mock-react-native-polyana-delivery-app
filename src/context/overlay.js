import React, {createContext, useContext, useMemo, useReducer} from "react";

const OverlayContext = createContext()

const types = {
    show: 'SHOW',
    hide: 'HIDE'
}

const initState = {
    text: '',
    show: false
}

function reducer(state, action) {
    switch (action.type) {
        case types.show:
            return {...state, text: action.payload.text, show: true}
        case types.hide:
            return {...state, show: false}
        default:
            return state
    }
}

export function useOverlayContext() {
    const context = useContext(OverlayContext)
    if (!context) throw new Error(`useOverlayContext must be within OverlayContextProvider`)
    return context
}

export function OverlayContextProvider(props) {
    const [state, dispatch] = useReducer(reducer, initState)
    const returnOverlayState = () => [state, dispatch]
    const value = useMemo(returnOverlayState, [state])

    return (
        <OverlayContext.Provider value={value} {...props}/>
    )
}

export function showOverlay(dispatch, text) {
    dispatch({
        type: types.show,
        payload: {
            text: text
        }
    })
}

export function hideOverlay(dispatch) {
    dispatch({
        type: types.hide
    })
}