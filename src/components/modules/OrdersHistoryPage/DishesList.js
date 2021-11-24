import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {Image} from "react-native-expo-image-cache";
import {borderRadius, fontSize} from "../../../config/styleConf";
import {ScrollView} from "react-native-gesture-handler";

export const DishesList = ({products}) => {
    return (
        <ScrollView
            style={styles.scrollView}
        >
            {
                products.map((product, i) => (
                    <View
                        key={product.product_id + i}
                        style={styles.dishSectionView}
                    >
                        <Image
                            style={styles.image}
                            uri={product.picture}
                            resizeMode={'cover'}
                        />
                        <View
                            style={styles.textSection}
                        >
                            <Text
                                style={styles.name}
                            >
                                {product.name}
                            </Text>
                            <View
                                style={styles.sumSection}
                            >
                                <Text
                                    style={styles.sum}
                                >
                                    {`${product.price} Р`}
                                </Text>
                                <Text
                                    style={styles.amount}
                                >
                                    {`${product.amount} шт`}
                                </Text>
                            </View>
                        </View>
                    </View>
                ))
            }
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        height: 200,
    },
    dishSectionView: {
        flexDirection: 'row',
        width: '100%',
        marginBottom: 20
    },
    image: {
        backgroundColor: '#f5f5f5',
        borderRadius: borderRadius.small,
        width: 90,
        height: 90,
    },
    textSection: {
        flex: 1,
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingVertical: 10
    },
    name: {
        fontSize: fontSize.small
    },
    sumSection: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    sum: {
        fontWeight: 'bold'
    },
    amount: {
        color: 'grey'
    }
})