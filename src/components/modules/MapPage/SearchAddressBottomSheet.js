import React, {forwardRef, useEffect, useState} from "react";
import BottomSheet from "reanimated-bottom-sheet";
import {TextInput, View, StyleSheet, Image, Text} from "react-native";
import {defaultPageHorizontalSafeArea, fontSize, margin} from "../../../config/styleConf";
import {makeDadataRequest} from "../../../functions/dadataFunctions";
import {Button} from "react-native-elements";
import {formKeys, setForm} from "../../../context/form";
import {appImages} from "../../../config/images";

const bottomSheetHeight = 450

export const SearchAddressBottomSheet = forwardRef((props, ref) => {

    const {currentCityObj, dispatchForm} = props

    const renderContent = () => (
        <View
            style={styles.view}
        >
            <View style={styles.panelHeader}>
                <View style={styles.panelHandle}/>
            </View>
            <View
                style={styles.contentView}
            >
                <AddressSection
                    currentCityObj={currentCityObj}
                    dispatchForm={dispatchForm}
                    hideBottomSheet={hideBottomSheet}
                />
            </View>
        </View>
    )

    return (
        <BottomSheet
            ref={ref}
            snapPoints={[bottomSheetHeight, 0]}
            borderRadius={10}
            renderContent={renderContent}
            initialSnap={1}
            enabledBottomInitialAnimation={true}
            enabledContentTapInteraction={false}
        />
    )

    function hideBottomSheet() {
        ref.current.snapTo(1)
    }
})

const AddressSection = ({currentCityObj, dispatchForm, hideBottomSheet}) => {

    const [addressText, setAddressText] = useState('')
    const [timerId, setTimerId] = useState(setTimeout(() => null, 0))
    const [addressArray, setAddressArray] = useState([])

    useEffect(() => {
        setAddressText('');
        setAddressArray([])
    } , [currentCityObj])

    return (
        <View>
            <View
                style={styles.inputSection}
            >
                <Image
                    source={appImages.search}
                    resizeMode={'contain'}
                    style={styles.searchImage}
                />
                <TextInput
                    placeholder={'Начните ввод адреса'}
                    style={styles.input}
                    value={addressText}
                    onChangeText={(text) => {
                        setAddressText(text);
                        handleSuggestionsFromServer(
                            timerId,
                            setTimerId,
                            text,
                            setAddressArray,
                            currentCityObj.city_fias_id
                        )
                    }}
                />
            </View>
            <SuggestionsSection
                addressArray={addressArray}
                setAddressText={setAddressText}
                dispatchForm={dispatchForm}
                hideBottomSheet={hideBottomSheet}
            />
        </View>
    )
}

async function handleSuggestionsFromServer (timerId, setTimerId, addressText, setAddressArray, city_fias_id) {

    clearTimeout(timerId)

    const newTimer = setTimeout(async () => {

        const response = await makeDadataRequest(
            "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address",
            {
                query: addressText,
                count: 5,
                locations: [
                    {
                        city_fias_id : city_fias_id
                    }
                ],
            }
        )

        try {
            const json = await response.json()
            setAddressArray(json.suggestions)
        } catch (e) {}

    }, 500)

    setTimerId(newTimer)
}

const SuggestionsSection = ({addressArray, setAddressText, dispatchForm, hideBottomSheet}) => {

    let jsx = null

    if (addressArray.length) {
        jsx =
            <>
                <Text
                    style={styles.tip}
                >
                    Продолжите ввод или выберите вариант
                </Text>
                {
                    addressArray.map((value, i) => (
                        <Button
                            key={i}
                            title={value.value}
                            type={'Clear'}
                            titleStyle={styles.addressButtonTitle}
                            buttonStyle={styles.addressButtonButton}
                            containerStyle={styles.addressButtonContainer}
                            onPress={() => {
                                setAddressText(value.value);
                                setForm(dispatchForm, formKeys.addressObj, value);
                                hideBottomSheet();
                            }}
                        />
                    ))
                }
            </>
    }

    return (
        <View
            style={styles.suggestionsSection}
        >
            {jsx}
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        height: bottomSheetHeight,
        backgroundColor: 'white'
    },
    panelHeader: {
        marginTop: 7,
        marginBottom: 5,
        alignItems: 'center'
    },
    panelHandle: {
        width: 40,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00000040',
        marginBottom: margin.small,
    },
    contentView: {
        marginHorizontal: defaultPageHorizontalSafeArea
    },
    inputSection: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    searchImage: {
        width: 20,
        height: 20,
        marginRight: 5
    },
    input: {
        width: '100%',
        padding: 5,
        fontSize: fontSize.preMedium
    },
    suggestionsSection: {
        marginTop: 5
    },
    tip: {
        fontSize: fontSize.small,
        color: 'grey'
    },
    addressButtonTitle: {
        textAlign: 'left', width: '100%', color: 'black'
    },
    addressButtonButton: {
        paddingHorizontal: 0
    },
    addressButtonContainer: {
        borderBottomWidth: 0.2
    }
})