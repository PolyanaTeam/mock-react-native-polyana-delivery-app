import React, {useRef, useState} from "react";
import {appVariable} from "../../../config/variableConf";
import DateTimePicker from "@react-native-community/datetimepicker";
import {View, StyleSheet} from "react-native";
import BottomSheet from "reanimated-bottom-sheet";
import {colors, padding} from "../../../config/styleConf";
import {DefaultButton} from "../../generics/DefaultButton";

export const DateInput = ({birthday, setIsShowDate, onChange, inputTypes}) => {

    const date = new Date(birthday)

    return appVariable.isIOS ?
        <IOSDataPicker
            defaultTime={date}
            onChangeDate={onChangeDate}
            setIsShowDate={setIsShowDate}
        />
        :
        <DateTimePicker
            value={date}
            mode={'date'}
            display={"default"}
            onChange={onChangeDate}
        />

    function onChangeDate(event, selectedDate) {
        setIsShowDate(false)
        if (selectedDate) {
            const date = new Date(selectedDate)
            const newFormatDate = date.getFullYear() + "-" +
                addLeadingZero(date.getMonth() + 1) + "-" +
                addLeadingZero(date.getDate())
            onChange(newFormatDate, inputTypes.birthday)
        }
    }
}

function addLeadingZero (day) {
    return day >= 10 ? day : '0' + day
}

const IOSDataPicker = ({defaultTime, onChangeDate, setIsShowDate}) => {

    const ref = useRef(null)
    const snapPoints = [270, 0]
    const snapTypes = {
        show: 0,
        hide: 1
    }
    const [date, setDate] = useState(defaultTime)
    const onChangeDateCurrent = (elem, date) => setDate(date)

    const renderContent = () => (
        <View
            style={styles.view}
        >
            <View style={styles.panelHeader}>
                <View style={styles.panelHandle}/>
            </View>
            <DateTimePicker
                value={date}
                mode={'date'}
                display="spinner"
                onChange={onChangeDateCurrent}
            />
            <DefaultButton
                containerStyle={styles.buttonContainer}
                title={'Принять'}
                onPress={() => {
                    onChangeDate(undefined, date)
                    ref.current.snapTo(snapTypes.hide)
                }}
            />
        </View>
    )

    return (
        <BottomSheet
            ref={ref}
            snapPoints={snapPoints}
            initialSnap={snapTypes.show}
            renderContent={renderContent}
            onCloseEnd={() => setIsShowDate(false)}
        />
    )
}

const styles = StyleSheet.create({
    view: {
        backgroundColor: 'white'
    },
    renderBlock : {
        borderTopWidth: 1,
        borderTopColor: '#f5f5f5',
        backgroundColor: colors.defaultColor3,
        padding: padding.medium
    },
    panelHeader: {
        alignItems: 'center'
    },
    buttonContainer: {
        marginHorizontal: 10
    }
})