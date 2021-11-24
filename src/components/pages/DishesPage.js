import React, {forwardRef, useEffect, useMemo, useRef, useState} from "react";
import {PageHorizontalSafeArea} from "../generics/PageHorizontalSafeArea";
import {useInitDataContext} from "../../context/initData";
import hexRgb from "hex-rgb";
import {returnRgba} from "../../functions/colorFunctions";
import {useWindowDimensions} from "react-native";
import {CategoriesCarousel} from "../modules/DishesPage/CategoriesCarousel";
import {TagsCarousel} from "../modules/DishesPage/TagsCarousel";
import {DishCarousel} from "../modules/DishesPage/DishCarousel";
import {DishBottomSheet} from "../modules/DishesPage/DishBottomSheet";
import {addDish, defaultBasketConceptIndex, useBasketContext} from "../../context/basket";
import {showOverlay, useOverlayContext} from "../../context/overlay";
import {OverlayModifiers} from "../generics/OverlayModifiers";

const sectionTypes = {
    category: 'category',
    tag: 'tag',
    dish: 'dish'
}

export const DishesPage = ({route}) => {

    const bottomSheetRef = useRef(null)
    const [{initData}] = useInitDataContext()
    const dimension = useWindowDimensions()
    const [{}, dispatchOverlay] = useOverlayContext()
    const [{basketConceptIndex}, dispatchBasket] = useBasketContext()
    const [bottomDishObj, setBottomDishObj] = useState({categoryIndex: 0, dishIndex: 0})
    const [sectionProps, setSectionProps] = useState({
        type: sectionTypes.category,
        props: {
            categoryIndex: 0
        }
    })
    const [overlayModifiersObj, setOverlayModifiersObj] = useState({isShow: false, dish: null})
    const conceptIndexFromRoute = route.params?.conceptIndex
    const conceptIndex = conceptIndexFromRoute ? conceptIndexFromRoute : 0
    const conceptObj = initData.concept[conceptIndex]
    const hexPrimaryColor = hexRgb(conceptObj.PrimaryColor)
    const hexSecondaryColor = hexRgb(conceptObj.SecondaryColor)
    const rgbaPrimaryColor = returnRgba(hexPrimaryColor.red, hexPrimaryColor.green, hexPrimaryColor.blue, 0.6)
    const rgbaSecondaryColor = returnRgba(hexSecondaryColor.red, hexSecondaryColor.green, hexSecondaryColor.blue, 0.6)
    const dish = conceptObj.menu[bottomDishObj.categoryIndex]?.dishes[bottomDishObj.dishIndex]

    useEffect(() => {

        const categoryIndex = route.params?.categoryIndex
        const tagName = route.params?.tagName
        const dishIndex = route.params?.dishIndex
        const dishCategoryIndex =  route.params?.dishCategoryIndex

        if (Number.isInteger(dishIndex) && Number.isInteger(dishCategoryIndex)) {
            setSectionProps({type: sectionTypes.dish, props: {
                dishIndex: dishIndex,
                dishCategoryIndex: dishCategoryIndex
            }})
        }
        else if (Number.isInteger(categoryIndex)) {
            setSectionProps({type: sectionTypes.category, props: {categoryIndex: categoryIndex}})
        }
        else if (tagName) {
            setSectionProps({type: sectionTypes.tag, props: {name: tagName}})
        }

        if (bottomSheetRef) bottomSheetRef.current.snapTo(1)
    }, [route])

    return (
        <>
            <PageHorizontalSafeArea>
                <PageDishSection
                    ref={bottomSheetRef}
                    conceptObj={conceptObj}
                    rgbaSecondaryColor={rgbaSecondaryColor}
                    rgbaPrimaryColor={rgbaPrimaryColor}
                    dimension={dimension}
                    setBottomDishObj={setBottomDishObj}
                    sectionProps={sectionProps}
                    setSectionProps={setSectionProps}
                    onClickDishButton={onClickDishButton}
                />
            </PageHorizontalSafeArea>
            <DishBottomSheet
                ref={bottomSheetRef}
                rgbaPrimaryColor={rgbaPrimaryColor}
                dish={dish}
                onClickDishButton={onClickDishButton}
            />
            <OverlayModifiers
                isVisible={overlayModifiersObj.isShow}
                dish={overlayModifiersObj.dish}
                hide={hideOverlayModifiers}
                basketConceptIndex={conceptIndex}
                dispatchBasket={dispatchBasket}
            />
        </>
    )

    function onClickDishButton (dishObj) {
        if (basketConceptIndex === defaultBasketConceptIndex || conceptIndex === basketConceptIndex) {
            if (!dishObj.modifiers.length) addDish(dispatchBasket, dishObj, conceptIndex)
            else setOverlayModifiersObj({isShow: true, dish: dishObj})
        }
        else showOverlay(dispatchOverlay, 'В Вашей корзине есть блюда из другого ресторана')
    }

    function hideOverlayModifiers () {
        setOverlayModifiersObj({isShow: false, dish: null})
    }
}

const PageDishSection = forwardRef((props, bottomSheetRef) => {

    const {
        conceptObj,
        rgbaPrimaryColor,
        rgbaSecondaryColor,
        dimension,
        setBottomDishObj,
        sectionProps,
        setSectionProps,
        onClickDishButton
    } = props
    const menu = conceptObj.menu
    const dishArray = useMemo(() => getDishArray(sectionProps, menu), [sectionProps])
    const menuTag = conceptObj.menuTag

    return (
        <>
            <CategoriesCarousel
                menu={menu}
                categoryIndex={sectionProps.props.categoryIndex}
                rgbaPrimaryColor={rgbaPrimaryColor}
                rgbaSecondaryColor={rgbaSecondaryColor}
                setSectionProps={setSectionProps}
                dimension={dimension}
                sectionTypes={sectionTypes}
            />
            <TagsCarousel
                name={sectionProps.props.name}
                setSectionProps={setSectionProps}
                menuTag={menuTag}
                rgbaPrimaryColor={rgbaPrimaryColor}
                rgbaSecondaryColor={rgbaSecondaryColor}
                dimension={dimension}
                sectionTypes={sectionTypes}
            />
            <DishCarousel
                ref={bottomSheetRef}
                dishArray={dishArray}
                rgbaPrimaryColor={rgbaPrimaryColor}
                setBottomDishObj={setBottomDishObj}
                onClickDishButton={onClickDishButton}
                menuTag={menuTag}
            />
        </>
    )
})

function getDishArray (sectionProps, menu) {
    switch (sectionProps.type) {
        case sectionTypes.category:
            const categoryIndex = sectionProps.props.categoryIndex
            return getCategoryDishes(menu[categoryIndex].dishes, categoryIndex)
        case sectionTypes.tag:
            return getTagDishesArray(sectionProps.props.name, menu)
        case sectionTypes.dish:
            const dishCategoryIndex = sectionProps.props.dishCategoryIndex
            const dishIndex = sectionProps.props.dishIndex
            return [getDishBeforePush(menu[dishCategoryIndex].dishes[dishIndex], dishCategoryIndex, dishIndex)]
    }

}

function getCategoryDishes(dishes, categoryIndex) {
    const arr = []

    dishes.forEach((dish, dishIndex) => arr.push(getDishBeforePush(dish, categoryIndex, dishIndex)))

    return arr
}

function getTagDishesArray(name, menu) {
    const arr = []

    menu.forEach((category, categoryIndex) => {
        category.dishes.forEach((dish, dishIndex) => {
            if (dish.tags.includes(name)) arr.push(getDishBeforePush(dish, categoryIndex, dishIndex))
        })
    })

    return arr
}

function getDishBeforePush (dish, categoryIndex, dishIndex) {
    dish['categoryIndex'] = categoryIndex
    dish['dishIndex'] = dishIndex

    return dish
}