import React, {forwardRef} from "react";
import BottomSheet from "reanimated-bottom-sheet";
import {Text, View, StyleSheet} from "react-native";
import {borderRadius, colors, defaultPageHorizontalSafeArea, fontSize} from "../../../config/styleConf";
import {DishesList} from "./DishesList";

const bottomSheetHeight = 400

export const OrderHistoryBottomSheet = forwardRef((props, ref) => {

    const {orders, orderIndex} = props

    return (
        <BottomSheet
            ref={ref}
            snapPoints={[bottomSheetHeight, 0]}
            borderRadius={10}
            initialSnap={1}
            enabledInnerScrolling={true}
            enabledBottomInitialAnimation={true}
            enabledContentTapInteraction={false}
            renderContent={() => <Content orders={orders} orderIndex={orderIndex}/>}
        />
    )
})

const Content = ({orders, orderIndex}) => {

    if (orderIndex === null) return null

    const orderObj = orders[orderIndex]

    return (
        <View
            style={styles.view}
        >
            <View
                style={styles.rectangleView}
            >
                <View
                    style={styles.rectangle}
                />
            </View>
            <View>
                <Text
                    style={styles.restoran}
                >
                    {orderObj.restoran}
                </Text>
                <Text
                    style={styles.address}
                >
                    {orderObj.address}
                </Text>
                <DishesList
                    products={orderObj.products}
                />
                <Text
                    style={styles.sumText}
                >
                    {`${orderObj.products.length} товара на `}
                    <Text
                        style={styles.sum}
                    >
                        {`${orderObj.sum} Р`}
                    </Text>
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    rectangleView: {
        width: '100%',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10
    },
    rectangle: {
        height: 5,
        width: 25,
        borderRadius: borderRadius.medium,
        backgroundColor: 'grey'
    },
    view: {
        height: bottomSheetHeight,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: defaultPageHorizontalSafeArea
    },
    restoran: {
        color: 'grey',
        fontWeight: 'bold',
        fontSize: fontSize.medium
    },
    address: {
        fontWeight: 'bold',
        fontSize: fontSize.medium,
        marginVertical: 10
    },
    sumText: {
        marginVertical: 10,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: fontSize.medium
    },
    sum: {
        color: colors.defaultColor2
    }
})