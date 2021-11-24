import React, {createContext, useContext, useMemo, useReducer} from "react";

const ConceptIndexContext = createContext()

export const defaultConceptIndex = null
const types = {
    setConceptIndex: 'SET_CONCEPT_INDEX'
}
const initState = {
    conceptIndex: defaultConceptIndex
}

function reducer (state, action) {
    switch (action.type) {
        case types.setConceptIndex:
            return {...state, conceptIndex: action.payload.conceptIndex}
        default:
            return state
    }
}

export function useConceptIndexContext() {
    const context = useContext(ConceptIndexContext)
    if (!context) throw new Error('useConceptIndexContext must be within ConceptIndexContextProvider')
    return context
}

export function ConceptIndexContextProvider(props) {
    const [state, dispatch] = useReducer(reducer, initState)
    const returnConceptIndexContextState = () => [state, dispatch]
    const value = useMemo(returnConceptIndexContextState, [state])

    return (
        <ConceptIndexContext.Provider value={value} {...props}/>
    )
}

export function setConceptIndex(dispatch, conceptIndex) {
    dispatch({
        type: types.setConceptIndex,
        payload: {
            conceptIndex: conceptIndex
        }
    })
}