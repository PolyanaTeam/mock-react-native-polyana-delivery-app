import {routeNameConfig} from "../config/routeNamesConfig";

export function handlePromotionButtonWant (promObj, conceptIndex, navigateToDishPage, conceptObj, navigation) {

    if (promObj.isProfile) {
        navigation.navigate(routeNameConfig.mainPage.profile)
    }
    else if (promObj.idGroup) {
        const categoryIndex = getCategoryIndex(conceptObj.menu, promObj.idGroup)
        navigateToDishPage({conceptIndex: conceptIndex, categoryIndex: categoryIndex})
    }
    else if (promObj.idMenu) {
        const dishIndexesObj =  getDishIndexesObj(conceptObj.menu, promObj.idMenu)
        navigateToDishPage({
            conceptIndex: conceptIndex,
            dishIndex: dishIndexesObj.dishIndex,
            dishCategoryIndex: dishIndexesObj.dishCategoryIndex
        })
    }
    else if (promObj.idTag) {
        const tagName = getTagName(conceptObj.menuTag, promObj.idTag)
        navigateToDishPage({conceptIndex: conceptIndex, tagName: tagName})
    }
}

function getDishIndexesObj(menu, id) {
    for (let i = 0; i < menu.length; i++) {

        const dishes = menu[i].dishes

        for (let a = 0; a < dishes.length; a++) if (dishes[a].id === id) return {dishIndex: a, dishCategoryIndex : i}
    }
}

function getCategoryIndex(menu, id) {
    for (let i = 0; i < menu.length; i++) if (id === menu[i].id) return i
}

function getTagName (tags, id) {
    for (let i = 0; i < tags.length; i++) if (id === tags[i].id) return tags[i].name
}