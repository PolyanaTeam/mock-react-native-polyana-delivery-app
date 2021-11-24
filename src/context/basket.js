import React, {createContext, useContext, useMemo, useReducer} from "react";
import {addToBasket, checkAddedToBasketDish, deleteDish, increaseBasketDish} from "../functions/basketFunctions";

const BasketContext = createContext()

const types = {
    ADD_DISH: 'ADD_DISH',
    DELETE_DISH_FROM_BASKET: 'DELETE_DISH_FROM_BASKET',
    CLEAR_BASKET: 'CLEAR_BASKET'
}

export const defaultBasketConceptIndex = null

const initState = {
    basketConceptIndex: defaultBasketConceptIndex,
    sum: 0,
    basket: []
}

function reducer (state, action) {

    let basket = state.basket
    const dishObj = action.payload?.dishObj
    const dishId = dishObj ? dishObj.id ? dishObj.id : dishObj.productId : null
    const basketConceptIndex = action.payload?.basketConceptIndex
    const modifiers = dishObj?.modifiers
    const isAdded = checkAddedToBasketDish(basket, dishId, modifiers)

    switch (action.type) {
        case types.ADD_DISH:

            basket = isAdded.bool ? increaseBasketDish(basket, isAdded.index) : addToBasket(basket, dishObj, modifiers)
            const conceptIndex = basketConceptIndex === undefined ? state.basketConceptIndex : basketConceptIndex

            return {
                ...state,
                sum: state.sum + dishObj.price,
                basket: basket,
                basketConceptIndex: conceptIndex
            }
        case types.DELETE_DISH_FROM_BASKET:

            if (isAdded.bool) basket = deleteDish(basket, isAdded.index)
            else return state

            return {
                ...state,
                sum: state.sum - basket.price,
                basket: basket.basket,
                basketConceptIndex : basket.basket.length ? state.basketConceptIndex : defaultBasketConceptIndex
            }
        case types.CLEAR_BASKET:
            return {...state, sum: 0, basket: [], basketConceptIndex: defaultBasketConceptIndex}
        default:
            return state
    }
}

export function useBasketContext() {
    const context = useContext(BasketContext)
    if (!context) throw new Error('useBasketContext must be within BasketContextProvider')
    return context
}

export function BasketContextProvider(props) {
    const [state, dispatch] = useReducer(reducer, initState)
    const returnBasketContextState = () => [state, dispatch]
    const value = useMemo(returnBasketContextState, [state])

    return (
        <BasketContext.Provider value={value} {...props}/>
    )
}

export function addDish(dispatch, dishObj = {}, basketConceptIndex) {
    dispatch({
        type: types.ADD_DISH,
        payload: {
            dishObj: dishObj,
            basketConceptIndex: basketConceptIndex
        }
    })
}

export function deleteDishFromBasket(dispatch, dishObj) {
    dispatch({
        type: types.DELETE_DISH_FROM_BASKET,
        payload: {
            dishObj: dishObj
        }
    })
}

export function clearBasket(dispatch) {
    dispatch({
        type: types.CLEAR_BASKET
    })
}