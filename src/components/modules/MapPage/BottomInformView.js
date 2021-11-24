import React, {forwardRef, useState} from "react";
import {Text, View, StyleSheet} from "react-native";
import {DefaultButton} from "../../generics/DefaultButton";
import {colors, defaultPageHorizontalSafeArea, fontSize} from "../../../config/styleConf";
import {setItemToStorage} from "../../../functions/storageFunction";
import {appVariable} from "../../../config/variableConf";
import {getInitDataFromServer} from "../../../functions/initDataFunctions";
import {initDataStatusTypes, setInitData, useInitDataContext} from "../../../context/initData";
import {routeNameConfig} from "../../../config/routeNamesConfig";
import {clearBasket, useBasketContext} from "../../../context/basket";

export const BottomInformView = forwardRef((props, bottomSheetRef) => {

    const [{initData}, dispatchInitData] = useInitDataContext()
    const [isLoadingInitData, setIsLoadingInitData] = useState(false)
    const [{}, dispatchBasket] = useBasketContext()
    const {addressObj, currentCityObj, dispatchOverlay, navigation} = props
    const isAddress = !!addressObj?.value
    let addressText = 'Выберите адрес доставки'

    if (isAddress) {
        addressText = addressObj.value
    }

    return (
        <View
            style={styles.bottomView}
        >
            <Text
                style={styles.bottomViewText}
            >
                {addressText}
            </Text>
            {
                isAddress ?
                    <DefaultButton
                        title={'Я здесь'}
                        containerStyle={styles.bottomViewButton}
                        titleStyle={styles.firstButtonTitle}
                        onPress={() => {
                            onClickAddressButton({
                                addressObj: addressObj,
                                currentCityObj: currentCityObj,
                                dispatchOverlay: dispatchOverlay,
                                setIsLoadingInitData: setIsLoadingInitData,
                                dispatchInitData: dispatchInitData,
                                navigation: navigation,
                                initData: initData,
                                dispatchBasket: dispatchBasket
                            })
                        }}
                        loading={isLoadingInitData}
                    />
                    :
                    null
            }
            <DefaultButton
                containerStyle={styles.bottomViewButton}
                title={'Уточнить адрес'}
                style={styles.secondButton}
                titleStyle={styles.secondButtonTitle}
                onPress={() => bottomSheetRef.current.snapTo(0)}
                isBorder={true}
            />
        </View>
    )
})

async function onClickAddressButton ({
    addressObj,
    currentCityObj,
    dispatchOverlay,
    setIsLoadingInitData,
    dispatchInitData,
    navigation,
    initData,
    dispatchBasket
}) {

    setItemToStorage(appVariable.storageKeys.addressObj, JSON.stringify(addressObj))

    if (initData?.city_fias_id !== currentCityObj.city_fias_id) {

        setIsLoadingInitData(true)

        const initDataFromServer = await getInitDataFromServer(currentCityObj.town, dispatchOverlay)
        setIsLoadingInitData(false)

        if (!initDataFromServer) return

        clearBasket(dispatchBasket)
        setInitData(dispatchInitData, initDataFromServer, initDataStatusTypes.DOWNLOADED)
    }

    navigation.navigate(routeNameConfig.appRoute.mainPage)
}

const styles = StyleSheet.create({
    bottomView: {
        paddingHorizontal: defaultPageHorizontalSafeArea,
        height: 250,
        backgroundColor: colors.defaultColor3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottomViewButton: {
        width: 150,
        marginBottom: defaultPageHorizontalSafeArea
    },
    bottomViewText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: fontSize.preMedium,
        marginBottom: defaultPageHorizontalSafeArea
    },
    firstButtonTitle: {
        fontSize: fontSize.small
    },
    secondButton: {
        backgroundColor: 'white'
    },
    secondButtonTitle: {
        color: colors.defaultColor2,
        fontSize: fontSize.small
    }
})