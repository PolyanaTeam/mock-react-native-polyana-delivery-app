import React from "react";
import {createNativeStackNavigator} from "react-native-screens/native-stack";
import {routeNameConfig} from "../../config/routeNamesConfig";
import {CategoriesPage} from "./CategoriesPage";
import {DishesPage} from "./DishesPage";

const Stack = createNativeStackNavigator()

export const MenuPage = () => {

    return (
        <Stack.Navigator initialRouteName={routeNameConfig.menuPage.categories} screenOptions={{headerShown: false}}>
            <Stack.Screen name={routeNameConfig.menuPage.categories} component={CategoriesPage}/>
            <Stack.Screen name={routeNameConfig.menuPage.dishes} component={DishesPage}/>
        </Stack.Navigator>
    )
}