import React from "react";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {routeNameConfig} from "../../config/routeNamesConfig";
import {BonusesPage} from "./BonusesPage";
import {ProfileInfoSettingsPage} from "./ProfileInfoSettingsPage";
import {Text, StyleSheet} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {
    defaultJsession, defaultOrdersHistory,
    defaultPersonalInfo,
    personalInfoStatusType,
    setPersonalInfoFromServer,
    usePersonalInfoContext
} from "../../context/personalInfo";
import {PageHorizontalSafeArea} from "../generics/PageHorizontalSafeArea";
import {DefaultButton} from "../generics/DefaultButton";
import {colors, fontSize} from "../../config/styleConf";
import {removeItemFromStorage} from "../../functions/storageFunction";
import {appVariable} from "../../config/variableConf";
import {PromocodePage} from "./PromocodePage";
import {OrdersHistoryPage} from "./OrdersHistoryPage";

const Tab = createMaterialTopTabNavigator()

export const ProfilePage = () => {

    const navigation = useNavigation()
    const [{personalInfo, ordersHistory, jsession}, dispatchPersonalInfo] = usePersonalInfoContext()

    let jsx =
        <PageHorizontalSafeArea
            style={styles.view}
        >
            <Text
                style={styles.text}
            >
                Авторизуйтесь для входа в профиль
            </Text>
            <DefaultButton
                style={styles.button}
                title={'Далее'}
                onPress={() => {
                    navigation.navigate(routeNameConfig.appRoute.authorization1, {
                        params: {
                            route: routeNameConfig.mainPage.profile
                        }
                    })
                }}
            />
        </PageHorizontalSafeArea>

    if (personalInfo) {
        jsx =
            <>
                <TopSection personalInfo={personalInfo} dispatchPersonalInfo={dispatchPersonalInfo} navigation={navigation}/>
                <Tab.Navigator
                    initialRouteName={routeNameConfig.profilePage.bonuses}
                    tabBarOptions={{
                        labelStyle : {
                            fontWeight: 'bold'
                        },
                        activeTintColor: 'black',
                        inactiveTintColor: 'grey',
                        indicatorStyle: {
                            borderBottomColor: colors.defaultColor2,
                            borderBottomWidth: 2,
                        },
                        scrollEnabled: true
                    }}
                >
                    <Tab.Screen name={routeNameConfig.profilePage.bonuses} component={BonusesPage}/>
                    <Tab.Screen name={routeNameConfig.profilePage.profileInfoSettings} component={ProfileInfoSettingsPage}/>
                    <Tab.Screen name={routeNameConfig.profilePage.promocode} component={PromocodePage}/>
                    <Tab.Screen name={routeNameConfig.profilePage.orders}>
                        {
                            () => (
                                <OrdersHistoryPage
                                    ordersHistory={ordersHistory}
                                    jsession={jsession}
                                />
                            )
                        }
                    </Tab.Screen>
                </Tab.Navigator>
            </>
    }

    return jsx
}

const TopSection = ({personalInfo, navigation, dispatchPersonalInfo}) => {

    return (
        <PageHorizontalSafeArea
            style={styles.topSectionView}
        >
            <Text
                style={styles.name}
            >
                {personalInfo.name}
            </Text>
            <DefaultButton
                style={styles.buttonExit}
                title={'Выход'}
                titleStyle={styles.buttonExitTitle}
                onPress={logOut}
            />
        </PageHorizontalSafeArea>
    )

    function logOut () {
        removeItemFromStorage(appVariable.storageKeys.jsession)
        navigation.navigate(routeNameConfig.mainPage.restaurants)
        setPersonalInfoFromServer(dispatchPersonalInfo, defaultPersonalInfo, personalInfoStatusType.notSignIn,
            defaultJsession, defaultOrdersHistory)

    }
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: fontSize.medium,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center'
    },
    button: {
        paddingHorizontal: 15
    },
    topSectionView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10
    },
    buttonExit: {
        marginLeft: 10,
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    buttonExitTitle: {
        fontSize: fontSize.little
    },
    name: {
        fontSize: fontSize.small
    }
})