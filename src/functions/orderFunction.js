import {appVariable} from "../config/variableConf";
import {defaultJsession} from "../context/personalInfo";

export function getOrderBody (propObj) {

    const formData = propObj.form
    const basket = propObj.basket
    const initData = propObj.initData
    const conceptIndex = propObj.conceptIndex
    const jsession = propObj.jsession

    let data = {
        dishes:             filterDishesForOrder(basket.basket),
        name:               formData.name,
        comment:            formData.comment,
        coupone:            formData.promo,
        paymentTypeId:      formData.paymentTypeId,
        paymentTypeBool:    initData.concept[conceptIndex].payment.filter(elem => {
                                return elem.id === formData.paymentTypeId
                            })[0].online === "true",
        sum:                basket.sum,
        personsCount:       formData.personsCount,
        conceptionName:     appVariable.siteName,
        conceptId:          initData.concept[conceptIndex].id,
        phone:              formData.phone,
        jsession:           jsession,
        discounts:          {sum: formData.bonuses},
        isCallback:         formData.isCallback
    }

    let additionalData = {}

    if (formData.deliveryType === appVariable.deliveryTypes.delivery) {

        additionalData.address          = formData.addressObj
        additionalData.flat             = formData.flat
        additionalData.entrance         = formData.entrance
        additionalData.floor            = formData.floor
        additionalData.doorphone        = formData.doorphone
        additionalData.terminal_id      = formData.checkFormServerAnswer.terminal_id
        additionalData.cost_delivery    = formData.checkFormServerAnswer.cost_delivery
        additionalData.isSelfService    = false
    }
    else if (formData.deliveryType === appVariable.deliveryTypes.selfDelivery) {

        additionalData.terminal_id      = formData.terminalID
        additionalData.isSelfService    = true
    }

    return getBodyToServer(data, additionalData)
}

function getBodyToServer(data, additionalData) {

    let customer = {}
    customer.name       = data.name
    customer.phone      = data.phone
    customer.address    = additionalData.address
    customer.flat       = additionalData.flat
    customer.entrance   = additionalData.entrance
    customer.floor      = additionalData.floor
    customer.doorphone  = additionalData.doorphone

    let payments = {}
    payments.paymentTypeId  = data.paymentTypeId
    payments.online         = data.paymentTypeBool
    payments.sum            = data.sum

    let order = {}
    order.sum               = data.sum
    order.payments          = payments
    order.customer          = customer
    order.personsCount      = isNaN(Number(data.personsCount)) ? 0 : Number(data.personsCount)
    order.orderServiceType  = additionalData.isSelfService ? "DeliveryByClient" : "DeliveryByCourier"
    order.terminal_id       = additionalData.terminal_id
    order.items             = data.dishes
    order.cost_delivery     = additionalData.cost_delivery
    order.isCallback        = data.isCallback

    let formData = {}

    if (data.jsession !== defaultJsession) {
        formData.jsession   = data.jsession
        order.discounts     = data.discounts
    }

    formData.site       = data.conceptionName
    formData.conceptId  = data.conceptId
    formData.comment    = data.comment
    formData.promo      = data.coupone
    formData.order      = order
    formData.mobileapp  = true

    return formData
}

function filterDishesForOrder(dishes) {

    let newDishes = JSON.parse(JSON.stringify(dishes))

    newDishes.forEach(basketElement => {

        const oldPrice = basketElement.oldPrice

        if (oldPrice) basketElement.price = oldPrice

        delete basketElement.picture
        delete basketElement.oldPrice
    })

    return newDishes
}