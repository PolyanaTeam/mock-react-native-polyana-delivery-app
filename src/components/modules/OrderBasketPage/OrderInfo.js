import React from "react";
import {View, StyleSheet, ScrollView, Text} from "react-native";
import {fontSize} from "../../../config/styleConf";

export const OrderInfo = ({checkFormServerAnswer}) => {

    let jsxPromo = null
    let jsxAddress = null

    if (checkFormServerAnswer.promotions.length > 0) {
        jsxPromo =
            <View style={{marginVertical: 10}}>
                <Text style={styles.textDescription}>Акции:</Text>
                {
                    checkFormServerAnswer.promotions.map((v,i) => {
                        return(
                            <Text style={{...styles.text, marginLeft: 20}} key={i}>{v}</Text>
                        )
                    })
                }
            </View>
    }

    if (checkFormServerAnswer.addr_value !== undefined) {
        jsxAddress =
            <>
                <View>
                    <Text style={styles.textDescription}>
                        Адрес доставки:
                    </Text>
                    <Text style={{...styles.text, marginLeft: 20, marginVertical: 5}}>
                        {checkFormServerAnswer.addr_value}
                    </Text>
                </View>
                <View style={styles.textBlock}>
                    <Text style={styles.textDescription}>
                        Время доставки:
                    </Text>
                    <Text style={styles.text}>
                        {checkFormServerAnswer.def_delivery_time} мин
                    </Text>
                </View>
                <View style={styles.textBlock}>
                    <Text style={styles.textDescription}>
                        Стоимость доставки:
                    </Text>
                    <Text style={styles.text}>
                        {checkFormServerAnswer.cost_delivery}
                        {" Р"}
                    </Text>
                </View>
            </>
    }

    return (
        <ScrollView
            style={styles.container}
        >
            {jsxPromo}
            {jsxAddress}
            <View style={styles.textBlock}>
                <Text style={styles.textDescription}>
                    Общая стоимость:
                </Text>
                <Text style={styles.text}>
                    {checkFormServerAnswer.sum_pay}
                    {" Р"}
                </Text>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20
    },
    textBlock: {
        marginVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    textDescription: {
        fontSize: fontSize.preMedium,
        fontWeight: 'bold',
        color: 'grey'
    },
    text: {
        fontWeight: 'bold',
        fontSize: fontSize.preMedium
    }
})