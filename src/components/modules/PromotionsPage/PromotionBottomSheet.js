import React, {forwardRef} from "react";
import BottomSheet from "reanimated-bottom-sheet";
import {StyleSheet, Text, View} from "react-native";
import {fontSize} from "../../../config/styleConf";
import {Image} from "react-native-expo-image-cache";
import {ScrollView} from "react-native-gesture-handler";
import {DefaultButton} from "../../generics/DefaultButton";

const bottomSheetHeight = 400

export const PromotionBottomSheet = forwardRef((props, ref) => {

    const {promotionObj, pressWantButtonBottomSheet} = props

    return (
        <BottomSheet
            ref={ref}
            snapPoints={[bottomSheetHeight, 0]}
            borderRadius={10}
            initialSnap={1}
            enabledInnerScrolling={true}
            enabledBottomInitialAnimation={true}
            enabledContentTapInteraction={false}
            renderContent={() => <PromotionContent promotionObj={promotionObj} pressWantButtonBottomSheet={pressWantButtonBottomSheet}/>}
        />
    )
})

const PromotionContent = ({promotionObj, pressWantButtonBottomSheet}) => {

    if (!promotionObj) return null

    return (
        <View
            style={styles.view}
        >
            <Image
                style={styles.image}
                uri={promotionObj.imageLink}
                resizeMode={'cover'}
            />
            <ScrollView
                style={styles.scrollView}
            >
                <Text
                    style={styles.name}
                >
                    {promotionObj.name}
                </Text>
                <Text
                    style={styles.description}
                >
                    {promotionObj.description}
                </Text>
            </ScrollView>
            <DefaultButton
                title={'Хочу'}
                titleStyle={styles.buttonTitle}
                style={styles.buttonStyle}
                onPress={pressWantButtonBottomSheet}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        height: bottomSheetHeight,
        backgroundColor: 'white'
    },
    image: {
        width: '100%',
        height: 130
    },
    scrollView: {
        flex: 1,
        marginTop: 5,
        marginHorizontal: 5
    },
    buttonTitle: {
        fontSize: fontSize.small
    },
    buttonStyle: {
        marginHorizontal: 5,
        marginBottom: 10
    },
    name: {
        fontSize: fontSize.preMedium,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    description: {
        color: 'grey',
        fontSize: fontSize.small
    },
})