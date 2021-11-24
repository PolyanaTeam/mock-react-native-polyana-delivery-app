import React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {routeNameConfig} from "../../config/routeNamesConfig";
import {RestaurantsPage} from "./RestaurantsPage";
import {Image, StyleSheet} from "react-native";
import {appImages} from "../../config/images";
import {MenuPage} from "./MenuPage";
import {PromotionsPage} from "./PromotionsPage";
import {ProfilePage} from "./ProfilePage";
import {PageHorizontalSafeArea} from "../generics/PageHorizontalSafeArea";
import {MainHeader} from "../generics/MainHeader";
import {PageSafeArea} from "../generics/PageSafeArea";

const Tab = createBottomTabNavigator()

export const MainPage = () => {

    return (
        <PageSafeArea>
            <PageHorizontalSafeArea>
                <MainHeader/>
            </PageHorizontalSafeArea>
            <Tab.Navigator
                initialRouteName={routeNameConfig.mainPage.restaurants}
                tabBarOptions={
                    {
                        activeTintColor: 'grey',
                        inactiveTintColor: 'grey',
                        tabStyle: {backgroundColor: 'white'}
                    }
                }
                screenOptions={({route}) => getScreenOptions(route)}
            >
                <Tab.Screen
                    name={routeNameConfig.mainPage.restaurants}
                    component={RestaurantsPage}
                />
                <Tab.Screen
                    name={routeNameConfig.mainPage.menu}
                    component={MenuPage}
                />
                <Tab.Screen
                    name={routeNameConfig.mainPage.promotions}
                    component={PromotionsPage}
                />
                <Tab.Screen
                    name={routeNameConfig.mainPage.profile}
                    component={ProfilePage}
                />
            </Tab.Navigator>
        </PageSafeArea>
    )
}

function getScreenOptions (route) {
    return({
        tabBarIcon: ({focused}) => {
            switch (route.name) {
                case routeNameConfig.mainPage.restaurants:
                    const icon1 = focused ?  appImages.restActive : appImages.restInactive
                    return (<Image source={icon1} style={styles.image} resizeMode={'contain'}/>)
                case routeNameConfig.mainPage.menu:
                    const icon2 = focused ?  appImages.basketActive : appImages.basketInactive
                    return (<Image source={icon2} style={styles.image} resizeMode={'contain'}/>)
                case routeNameConfig.mainPage.promotions:
                    const icon3 = focused ? appImages.promotionActive : appImages.promotionsInactive
                    return (<Image source={icon3} style={styles.image} resizeMode={'contain'}/>)
                case routeNameConfig.mainPage.profile:
                    const icon4 = focused ? appImages.userActive : appImages.userInactive
                    return (<Image source={icon4} style={styles.image} resizeMode={'contain'}/>)
            }
        }
    })
}

const styles = StyleSheet.create({
    image: {
        width: 25,
        height: 25
    }
})