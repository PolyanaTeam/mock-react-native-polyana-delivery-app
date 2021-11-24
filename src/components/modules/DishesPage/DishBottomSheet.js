import React, {forwardRef} from "react";
import BottomSheet from "reanimated-bottom-sheet";
import {View, StyleSheet, Text} from "react-native";
import {fontSize} from "../../../config/styleConf";
import {ScrollView} from "react-native-gesture-handler";
import {Image} from "react-native-expo-image-cache";
import {DefaultButton} from "../../generics/DefaultButton";
import {BackgroundImage} from "react-native-elements/dist/config";
import {appImages} from "../../../config/images";

const bottomSheetHeight = 400

export const DishBottomSheet = forwardRef((props, ref) => {

    const {dish, rgbaPrimaryColor, onClickDishButton} = props

    return (
        <BottomSheet
            ref={ref}
            snapPoints={[bottomSheetHeight, 0]}
            borderRadius={10}
            initialSnap={1}
            enabledInnerScrolling={true}
            enabledBottomInitialAnimation={true}
            enabledContentTapInteraction={false}
            renderContent={() => (
                <ContentBottomSheet
                    dish={dish}
                    rgbaPrimaryColor={rgbaPrimaryColor}
                    onClickDishButton={onClickDishButton}
                    hideBottomSheet={hideBottomSheet}
                />
            )}
        />
    )

    function hideBottomSheet () {
        ref.current.snapTo(1)
    }
})

const ContentBottomSheet = ({dish, rgbaPrimaryColor, onClickDishButton, hideBottomSheet}) => {

    if (!dish) return null

    return (
        <View style={styles.view}>
            <BackgroundImage
                style={styles.image}
                source={appImages.dishStub}
                resizeMode={'cover'}
            >
                {
                    dish.picture ?
                        <Image
                            style={styles.image}
                            uri={dish.picture}
                            resizeMode={'cover'}
                        />
                        :
                        null
                }
            </BackgroundImage>
            <ScrollView
                style={styles.scrollView}
            >
                <Text
                    style={styles.description}
                >
                    {dish.description}
                </Text>
            </ScrollView>
            <View
                style={styles.section}
            >
                <Text
                    style={styles.name}
                >
                    {dish.name}
                    {" "}
                    <Text
                        style={styles.weight}
                    >
                        {dish.weight}
                    </Text>
                </Text>
                <DefaultButton
                    style={{backgroundColor: rgbaPrimaryColor}}
                    title={dish.price + " Р"}
                    titleStyle={styles.buttonTitle}
                    onPress={() => {
                        onClickDishButton(dish)
                        hideBottomSheet()
                    }}
                />
            </View>
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
        height: 200
    },
    scrollView: {
        flex: 1,
        marginHorizontal: 5
    },
    description: {
        marginTop: 10,
        fontSize: fontSize.small,
        color: 'grey'
    },
    section: {
        marginHorizontal: 5,
        marginBottom: 10
    },
    name: {
        marginBottom: 5,
        fontSize: fontSize.preMedium,
        fontWeight: 'bold'
    },
    weight: {
        color: 'grey',
        fontSize: fontSize.little
    },
    buttonTitle: {
        fontSize: fontSize.small
    }
})