import React, {useEffect} from "react";
import {formKeys, setForm} from "../../../context/form";
import {Input} from "../../generics/Input";
import {appVariable} from "../../../config/variableConf";
import {DeliveryForm} from "./DeliveryForm";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {LogBox, StyleSheet} from "react-native";
import {BasketSelector} from "./BasketSelector";
import {getPhoneKeyboardType} from "../../../functions/inputFunctons";
import {checkLengthPhone} from "../../../functions/textFunctions";
import {CheckBox} from "react-native-elements";
import {borderRadius, colors} from "../../../config/styleConf";

export const Form = ({form, dispatchForm, navigation, initData, basketConceptIndex}) => {

    const {
        deliveryType,
        name,
        phone,
        paymentTypeId,
        addressObj,
        flat,
        entrance,
        floor,
        doorphone,
        terminalID,
        personsCount,
        comment,
        promo,
        isCallback
    } = form

    useEffect(() => {
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    }, [])

    return (
        <KeyboardAwareScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
        >
            <DeliveryTypeSelector
                deliveryType={deliveryType}
                handleValue={(value) => setForm(dispatchForm, formKeys.deliveryType, value)}
            />
            <Input
                containerStyle={styles.marginBottomContainer}
                text={'Имя*'}
                value={name}
                onChangeText={(value) => setForm(dispatchForm, formKeys.name, value)}
            />
            <Input
                containerStyle={styles.marginBottomContainer}
                text={'Телефон*'}
                value={phone}
                keyboardType={getPhoneKeyboardType()}
                onChangeText={value => checkLengthPhone(value,() => setForm(dispatchForm, formKeys.phone, value))}
            />
            <PaymentTypeSelector
                paymentTypeId={paymentTypeId}
                handleValue={(value) => setForm(dispatchForm, formKeys.paymentTypeId, value)}
                initData={initData}
                basketConceptIndex={basketConceptIndex}
            />
            {
                deliveryType === appVariable.deliveryTypes.delivery ?
                    <DeliveryForm
                        addressObj={addressObj}
                        flat={flat}
                        entrance={entrance}
                        floor={floor}
                        doorphone={doorphone}
                        navigation={navigation}
                        dispatchForm={dispatchForm}
                    />
                    :
                    <RestaurantSelector
                        terminalID={terminalID}
                        handleValue={value => setForm(dispatchForm, formKeys.terminalID, value)}
                        initData={initData}
                        basketConceptIndex={basketConceptIndex}
                    />
            }
            <Input
                text={'Кол-во персон'}
                containerStyle={styles.marginBottomContainer}
                value={personsCount}
                onChangeText={value => setForm(dispatchForm, formKeys.personsCount, value)}
                keyboardType={getPhoneKeyboardType()}
            />
            <Input
                text={'Коментарий'}
                containerStyle={styles.marginBottomContainer}
                value={comment}
                onChangeText={value => setForm(dispatchForm, formKeys.comment, value)}
            />
            <Input
                text={'Промокод'}
                containerStyle={styles.marginBottomContainer}
                value={promo}
                onChangeText={value => setForm(dispatchForm, formKeys.promo, value)}
            />
            <CheckBox
                containerStyle={{...styles.checkBox, ...styles.marginBottomContainer}}
                checked={!isCallback}
                checkedColor={colors.defaultColor2}
                title={"Не перезванивать"}
                onPress={() => setForm(dispatchForm, formKeys.isCallback, !isCallback)}
            />
        </KeyboardAwareScrollView>
    )
}

const DeliveryTypeSelector = ({deliveryType, handleValue}) => {

    const itemsArray = [
        {label: 'Доставка', value: appVariable.deliveryTypes.delivery},
        {label: 'Самовывоз', value: appVariable.deliveryTypes.selfDelivery}
    ]

    return (
        <BasketSelector
            text={'Способ доставки*'}
            containerStyle={styles.marginBottomContainer}
            itemsArray={itemsArray}
            valueDefault={deliveryType}
            handleValue={handleValue}
        />
    )
}

const PaymentTypeSelector = ({paymentTypeId, handleValue, initData, basketConceptIndex}) => {

    const payment = initData.concept[basketConceptIndex].payment
    const stopPaymentOnline = initData.concept[basketConceptIndex].stopPaymentOnline
    const itemsArray = payment.map(v => {
        if (!(stopPaymentOnline && v.online === "true")) {
            return {
                label: v.name,
                value: v.id,
            }
        }
    }).filter(v => v !== undefined)

    return (
        <BasketSelector
            zIndex={10}
            text={'Способ оплаты*'}
            placeholder={'Выберите способ оплаты'}
            containerStyle={styles.marginBottomContainer}
            itemsArray={itemsArray}
            valueDefault={paymentTypeId}
            handleValue={handleValue}
        />
    )
}

const RestaurantSelector = ({terminalID, handleValue, initData, basketConceptIndex}) => {

    const terminals = initData.concept[basketConceptIndex].terminals
    const itemsArray = terminals.map(v => {
        return {
            label: v.address,
            value: v.id
        }
    })

    return (
        <BasketSelector
            text={'Ресторан*'}
            placeholder={'Выберите ресторан'}
            containerStyle={styles.marginBottomContainer}
            itemsArray={itemsArray}
            valueDefault={terminalID}
            handleValue={handleValue}
        />
    )
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        marginTop: 10,
        marginBottom: 60
    },
    marginBottomContainer: {
        marginBottom: 10
    },
    checkBox: {
        width: '100%',
        marginLeft: 0,
        borderRadius: borderRadius.small,
        backgroundColor: 'white'
    }
})