import React, {useRef, useState} from "react";
import {Text, StyleSheet, View} from "react-native";
import {OrdersList} from "../modules/OrdersHistoryPage/OrdersList";
import {OrderHistoryBottomSheet} from "../modules/OrdersHistoryPage/OrderHistoryBottomSheet";

export const OrdersHistoryPage = ({ordersHistory, jsession}) => {

    const bottomSheetRef = useRef(null)
    const [orderIndex, setOrderIndex] = useState(null)
    const [orders, setOrders] = useState(ordersHistory)

    if (ordersHistory.length === 0) {
        return (
            <View
                style={styles.contentView}
            >
                <Text>
                    У вас пока нет совершённых заказов
                </Text>
            </View>
        )
    }

    return (
        <>
            <OrdersList
                orders={orders}
                setOrders={setOrders}
                openBottomSheet={openBottomSheet}
                jsession={jsession}
            />
            <OrderHistoryBottomSheet
                orders={orders}
                orderIndex={orderIndex}
                ref={bottomSheetRef}
            />
        </>
    )

    function openBottomSheet (orderIndex) {
        setOrderIndex(orderIndex)
        if (bottomSheetRef?.current) bottomSheetRef.current.snapTo(0)
    }
}

const styles = StyleSheet.create({
    contentView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})