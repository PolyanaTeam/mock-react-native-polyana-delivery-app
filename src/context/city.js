import React, {createContext, useContext, useMemo, useReducer} from "react";

const CityContext = createContext()

export const defaultCurrentCityObj = null
export const defaultCitiesArray = null
export const notChosenCurrentCityObj = 'notChosen'
export const cityKeys = {
    currentCityObj: 'currentCityObj'
}
const types = {
    setCurrentCityObj: 'SET_CURRENT_CITY_OBJ',
    setCitiesArray: 'SET_CITIES_ARRAY'
}
const initState = {
    currentCityObj: defaultCurrentCityObj,
    citiesArray: defaultCitiesArray
}

function reducer (state, action) {
    switch (action.type) {
        case types.setCurrentCityObj:
            return {...state, currentCityObj: action.payload.currentCityObj}
        case types.setCitiesArray:
            return {...state, citiesArray: action.payload.citiesArray}
        default:
            return state
    }
}

export function useCityContext() {
    const context = useContext(CityContext)
    if (!context) throw new Error(`useCityContext must be within CityContextProvider`)
    return context
}

export function CityContextProvider(props) {
    const [state, dispatch] = useReducer(reducer, initState)
    const returnCityContextState = () => [state, dispatch]
    const value = useMemo(returnCityContextState, [state])

    return (
        <CityContext.Provider value={value} {...props}/>
    )
}

export function setCurrentCityObj(dispatch, cityObj) {
    dispatch({
        type: types.setCurrentCityObj,
        payload: {
            currentCityObj: cityObj
        }
    })
}

export function setCitiesArray(dispatch, citiesArray) {
    dispatch({
        type: types.setCitiesArray,
        payload: {
            citiesArray: citiesArray
        }
    })
}