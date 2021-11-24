import React, {forwardRef, useEffect, useRef} from "react";
import {FlatList, Text, View, StyleSheet, TouchableOpacity} from "react-native";
import {BackgroundImage} from "react-native-elements/dist/config";
import {appImages} from "../../../config/images";
import {Image} from "react-native-expo-image-cache";
import {Button} from "react-native-elements";
import {borderRadius, fontSize} from "../../../config/styleConf";
import {SvgXml} from "react-native-svg";

export const DishCarousel = forwardRef((props, bottomSheetRef) => {

    const {dishArray, rgbaPrimaryColor, setBottomDishObj, onClickDishButton, menuTag} = props
    const ref = useRef()
    const numColumns = 2
    const dishSectionLength = 295
    const dishArrayLength = dishArray.length

    useEffect(() => {
        if (ref) ref.current.scrollToOffset({animated: false, offset: 0})
    }, [dishArray])

    if (dishArrayLength % 2 !== 0) dishArray.push({isEmpty: true, tags: []})

    return (
        <FlatList
            ref={ref}
            style={styles.flatList}
            data={dishArray}
            keyExtractor={item => item.id + item.order}
            numColumns={numColumns}
            initialNumToRender={6}
            maxToRenderPerBatch={4}
            showsVerticalScrollIndicator={false}
            getItemLayout={
                (data, index) => (
                    { index, length: dishSectionLength, offset: dishSectionLength * index })
            }
            renderItem={({item, index}) => {

                const tagsByOrder = item.tagsByOrder ? item.tagsByOrder : []
                const tags = !item.isEmpty ? menuTag.filter((item, i) => tagsByOrder.includes(i)) : []

                return (
                    <Dish
                        item={item}
                        index={index}
                        rgbaPrimaryColor={rgbaPrimaryColor}
                        showBottomSheetRef={showBottomSheetRef}
                        onClickButton={onClickDishButton}
                        tags={tags}
                    />
                )
            }}
        />
    )

    function showBottomSheetRef (categoryIndex, dishIndex) {
        setBottomDishObj({categoryIndex: categoryIndex, dishIndex: dishIndex})
        if (bottomSheetRef) bottomSheetRef.current.snapTo(0)
    }
})

const Dish = ({item, index, rgbaPrimaryColor, showBottomSheetRef, onClickButton, tags}) => {

    if (item.isEmpty) return <View style={styles.dishView}/>

    const viewStyle = index % 2 === 0 ? {marginRight: 5} : {marginLeft: 5}

    return (
        <View
            style={{...styles.dishView, ...viewStyle}}
        >
            <TouchableOpacity
                onPress={() => showBottomSheetRef(item.categoryIndex, item.dishIndex)}
            >
                <BackgroundImage
                    style={styles.image}
                    source={appImages.dishStub}
                    resizeMode={"cover"}
                >
                    <Image
                        style={styles.image}
                        uri={item.picture}
                        resizeMode={'cover'}
                    />
                </BackgroundImage>
                <TagsLine
                    tags={tags}
                />
            </TouchableOpacity>
            <Text
                numberOfLines={2}
                style={styles.name}
            >
                {item.name}
            </Text>
            <Text
                style={styles.weight}
                numberOfLines={1}
            >
                {item.weight}
            </Text>
            <Button
                containerStyle={styles.buttonContainer}
                buttonStyle={{...styles.buttonStyle, backgroundColor: rgbaPrimaryColor}}
                title={`${item.price} Р`}
                titleStyle={styles.buttonTitle}
                onPress={() => onClickButton(item)}
            />
        </View>
    )
}

const TagsLine = ({tags}) => (
    <View
        style={styles.tagSection}
    >
        {
            tags.map((item) => (
                <View
                    key={item.id}
                    style={styles.tagView}
                >
                    <SvgXml
                        width={'100%'}
                        height={'100%'}
                        xml={item.source}
                    />
                </View>
            ))
        }
    </View>
)

const styles = StyleSheet.create({
    flatList: {
        marginTop: 160
    },
    dishView: {
        flex: 1,
        height: 275,
        marginBottom: 20,
        borderRadius: borderRadius.small
    },
    image: {
        width: '100%',
        height: 150,
        borderRadius: borderRadius.small
    },
    name: {
        marginTop: 10,
        fontSize: fontSize.small,
        fontWeight: '700'
    },
    weight: {
        fontSize: 12,
        color: 'grey',
        marginTop: 2,
        marginBottom: 10
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        borderRadius: borderRadius.small
    },
    buttonTitle: {
        fontSize: fontSize.preMedium
    },
    buttonStyle: {
        padding: 5
    },
    tagSection: {
        flexDirection: 'row',
        position: 'absolute',
        top: 5,
        left: 5
    },
    tagView: {
        height: 30,
        width: 30,
        marginRight: 5
    }
})