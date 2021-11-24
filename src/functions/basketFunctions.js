import {compareModifiers, sortModifiers} from "./modifierFunctions";

export function checkAddedToBasketDish(basket, dishID, modifiers = []) {

    let i = 0

    for(let element of basket) {
        if (element.productId === dishID &&
            element.modifiers.length === modifiers.length &&
            compareModifiers(element.modifiers, sortModifiers(modifiers))
        ) {
            return {bool: true, index: i}
        }
        i++
    }
    return {bool: false}
}

export function increaseBasketDish(basket, index) {
    basket[index].amount += 1

    return basket
}

export function addToBasket(basket, dishObj, modifiers = []) {

    let newDishObj = {
        amount: 1,
        name: dishObj.name,
        productId: dishObj.id,
        price: dishObj.price,
        oldPrice: dishObj.oldPrice,
        picture: dishObj.picture,
        modifiers: sortModifiers(modifiers)
    }
    basket.push(newDishObj)

    return basket
}

export function deleteDish(basket, i) {

    let price = basket[i].price

    if (basket[i].amount > 1) {
        basket[i].amount -= 1
    } else {
        basket.splice(i, 1)
    }

    return {
        basket: basket,
        price: price
    }
}