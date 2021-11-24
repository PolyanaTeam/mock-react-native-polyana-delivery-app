import React from "react";
import {Text, View, StyleSheet, Linking} from "react-native";
import {usePersonalInfoContext} from "../../context/personalInfo";
import {fontSize} from "../../config/styleConf";
import {Button} from "react-native-elements";
import {useInitDataContext} from "../../context/initData";
import {PageHorizontalSafeArea} from "../generics/PageHorizontalSafeArea";

export const BonusesPage = () => {

    const [{personalInfo}] = usePersonalInfoContext()
    const [{initData}] = useInitDataContext()

    return (
        <PageHorizontalSafeArea
            style={styles.view}
        >
            <Text
                style={styles.descriptionText}
            >
                Накапливайте бонусы при каждом заказе.
                Воспользуйтесь бонусами в корзине.
                1 бонус = 1 рублю.
            </Text>
            <Text
                style={styles.bonusesText}
            >
                {personalInfo.bonuses}
                {" "}
                <Text
                    style={{fontWeight: 'normal'}}
                >
                    бонусов
                </Text>
            </Text>
            <Button
                type={'clear'}
                title={'Правила участия в бонусной системе'}
                onPress={() => Linking.openURL(initData.docLoyalty)}
                containerStyle={styles.buttonContainer}
                titleStyle={styles.buttonTitle}
            />
        </PageHorizontalSafeArea>
    )
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        marginTop: 10,
        alignItems: 'center'
    },
    descriptionText: {
        marginTop: 20,
        width: '100%',
        textAlign: 'center',
        color: 'grey',
        fontSize: fontSize.small
    },
    bonusesText: {
        marginTop: 20,
        fontWeight: 'bold',
        fontSize: fontSize.medium
    },
    buttonContainer: {
        marginTop: 20
    },
    buttonTitle: {
        fontSize: fontSize.small,
        color: 'black',
        fontStyle: 'italic'
    }
})