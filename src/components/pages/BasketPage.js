import React from "react";
import {createNativeStackNavigator} from "react-native-screens/native-stack";
import {routeNameConfig} from "../../config/routeNamesConfig";
import {CheckBasketPage} from "./CheckBasketPage";
import {FormBasketPage} from "./FormBasketPage";
import {OrderBasketPage} from "./OrderBasketPage";

const Stack = createNativeStackNavigator()

export const BasketPage = () => {
    return (
        <Stack.Navigator initialRouteName={routeNameConfig.basketPage.check} screenOptions={{headerShown: false}}>
            <Stack.Screen name={routeNameConfig.basketPage.check} component={CheckBasketPage}/>
            <Stack.Screen name={routeNameConfig.basketPage.form} component={FormBasketPage}/>
            <Stack.Screen name={routeNameConfig.basketPage.order} component={OrderBasketPage}/>
        </Stack.Navigator>
    )
}