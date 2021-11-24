import React, {useState} from "react";
import {Text, View, StyleSheet, ScrollView} from "react-native";
import {borderRadius, defaultPageHorizontalSafeArea, fontSize} from "../../../config/styleConf";
import {DefaultButton} from "../../generics/DefaultButton";
import {makeApiRequest} from "../../../functions/requestToApi";
import {appVariable} from "../../../config/variableConf";
import {showOverlay, useOverlayContext} from "../../../context/overlay";

export const OrdersList = ({orders, setOrders, openBottomSheet, jsession}) => {

    const [isLoading, setIsLoading] = useState(false)
    const [{}, dispatchOverlay] = useOverlayContext()

    return (
        <ScrollView
            contentContainerStyle={style.scrollViewContentContainerStyle}
        >
            <List
                orders={orders}
                openBottomSheet={openBottomSheet}
            />
            {
                orders.length % 10 === 0 ?
                    <DefaultButton
                        title={'Далее'}
                        onPress={onClickNext}
                        loading={isLoading}
                    />
                    :
                    null
            }
        </ScrollView>
    )

    async function onClickNext () {
        const length = orders.length
        const body = {
            jsession: jsession,
            lastOrderIndex: length,
            ordersCount: length + 10
        }
        const handleNetworkError = () => showOverlay(dispatchOverlay, 'Возникла ошибка')
        const handleSuccess = (payload) => setOrders([...orders, ...payload.ordersHistory])
        const handleError = () => showOverlay(dispatchOverlay, 'Возникла ошибка')

        setIsLoading(true)
        await makeApiRequest(appVariable.getOrders, body, handleNetworkError, handleSuccess, handleError)
        setIsLoading(false)
    }
}

const List = ({orders, openBottomSheet}) => {

    return (
        <>
            {
                orders.map((order, index) => {
                    return (
                        <View
                            key={order.docId}
                            style={style.orderView}
                        >
                            <View
                                style={style.orderView1}
                            >
                                <Text
                                    style={style.restoranName}
                                >
                                    {
                                        order.restoran
                                    }
                                </Text>
                                <Text
                                    style={style.time}
                                >
                                    {
                                        order.whenConfirmed
                                    }
                                </Text>
                                <Text
                                    style={style.address}
                                >
                                    {
                                        order.address
                                    }
                                </Text>
                            </View>
                            <View
                                style={style.orderView2}
                            >
                                <Text
                                    style={style.sum}
                                >
                                    {
                                        order.sum
                                    }
                                    {' Р'}
                                </Text>
                                <DefaultButton
                                    onPress={() => openBottomSheet(index)}
                                    title={'подробнее'}
                                    titleStyle={style.detailButtonTittle}
                                />
                            </View>
                        </View>
                    )
                })
            }
        </>
    )
}

const style = StyleSheet.create({
    scrollViewContentContainerStyle: {
        padding: defaultPageHorizontalSafeArea
    },
    orderView: {
        backgroundColor: "#ffffff",
        padding: 10,
        marginBottom: 16,
        borderRadius: borderRadius.small,
        flexDirection: 'row',

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4
    },
    orderView1: {
        width: '75%',
    },
    restoranName: {
        color: 'grey',
        fontSize: fontSize.small
    },
    time: {
        fontWeight: 'bold',
        fontSize: fontSize.small
    },
    address: {
        color: 'grey',
        fontStyle: 'italic',
        fontSize: fontSize.small
    },
    orderView2: {
        width: '25%',
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'space-between'
    },
    sum: {
        color: 'grey',
        fontWeight: 'bold',
        fontSize: fontSize.small
    },
    detailButtonTittle: {
        fontSize: fontSize.little
    }
})