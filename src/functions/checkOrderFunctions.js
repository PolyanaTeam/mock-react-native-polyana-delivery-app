import {appVariable} from "../config/variableConf";
import {handlePhone, testPhoneIsValid} from "./textFunctions";
import {defaultJsession} from "../context/personalInfo";

export function checkOrder(propObj) {

    const formObj = propObj.form
    const sum = propObj.sum
    const dishes = propObj.dishes
    const id = propObj.id
    const jsession = propObj.jsession

    let phone = handlePhone(formObj.phone)
    let filteredDishes = filterDishesForCheck(dishes)

    //errorForm and function addError
    let errorForm = {
        text: "Данные некорректно заполнены"
    }
    const addError = (error) => {
        errorForm.text = error
    }

    let data = {
        dishes:         filteredDishes,
        phone:          phone,
        conceptId:      id,
        site:           appVariable.siteName,
        address:        {},
        pickupRestID:   "",
        promo:          formObj.promo,
        sum:            sum
    }

    if (jsession !== defaultJsession) {
        data.jsession = jsession
        data.discounts = {sum: formObj.bonuses}
    }

    const isPayment = checkNotEmpty(formObj.paymentTypeId, addError, "Выберите способ оплаты")
    const checkPhone = checkPhoneNumber(phone, addError)
    const checkName = checkNotEmpty(formObj.name, addError, "Введите ваше имя")
    const isSumMore = checkUserError(sum, addError, "Ваша корзина пустая", (v) => v > 0)

    if (formObj.deliveryType === appVariable.deliveryTypes.delivery) {

        const checkFlat = checkNotEmpty(formObj.flat, addError, "Введите квартиру")
        const checkStreetObj = checkUserError(formObj.addressObj, addError, "Выберите адрес",
            (v) => Object.keys(v).length > 0)
        const checkHouseOfAddress = checkUserError(formObj.addressObj.data.house, addError,
            "В адресе не был указан дом", (v) => {
                return !!v
            })

        if (isPayment && checkFlat && checkStreetObj && checkPhone && checkName && isSumMore && checkHouseOfAddress) {
            data.address = formObj.addressObj

            return data
        }
    }
    else if (formObj.deliveryType === appVariable.deliveryTypes.selfDelivery) {

        const checkSelfRest = checkNotEmpty(formObj.terminalID, addError, "Выберите ресторан для самовывоза")

        if (isPayment && checkSelfRest && checkPhone && checkName && isSumMore ) {
            data.pickupRestID = formObj.terminalID

            return data
        }
    }

    return {
        errorForm: errorForm
    }
}

function filterDishesForCheck(dishes) {

    let newDishes = JSON.parse(JSON.stringify(dishes))

    newDishes.forEach(basketElement => {

        basketElement.id = basketElement.productId

        delete basketElement.price
        delete basketElement.picture
        delete basketElement.productId
        delete basketElement.oldPrice
    })

    return newDishes
}

function checkPhoneNumber (phoneNumber, addError) {
    if (testPhoneIsValid(phoneNumber)) return true
    addError("Введён некорректный номер телефона")
    return false
}

function checkNotEmpty (value, addError, error) {
    if (value !== "") return true
    addError(error)
    return false
}

function checkUserError (v, addError, error, action) {
    if (action(v)) return true
    addError(error)
    return false
}