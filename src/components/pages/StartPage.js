import React from "react";
import {ImageBackground, View, StyleSheet, Image} from "react-native";
import {DefaultButton} from "../generics/DefaultButton";
import {colors, fontSize, padding} from "../../config/styleConf";
import {useNavigation} from "@react-navigation/native";
import {routeNameConfig} from "../../config/routeNamesConfig";
import {personalInfoStatusType, usePersonalInfoContext} from "../../context/personalInfo";
import {defaultCitiesArray, useCityContext} from "../../context/city";
import {appImages} from "../../config/images";

export const StartPage = ({backgroundImgSource, isShowLogo}) => {

    const navigation = useNavigation()
    const [{citiesArray}] = useCityContext()
    const [{status, personalInfo}] = usePersonalInfoContext()
    let isLoadingPersonalInfo = false
    let isLoadingCitiesArray = true
    let personalInfoTitle = 'Войти'
    let onPressPersonalInfo = () => navigation.navigate(routeNameConfig.appRoute.authorization1)

    if (status === personalInfoStatusType.downloading) isLoadingPersonalInfo = true
    else if (status === personalInfoStatusType.signIn) {
        personalInfoTitle = personalInfo.name
        onPressPersonalInfo = () => navigation.navigate(routeNameConfig.appRoute.mapPage)
    }

    if (citiesArray !== defaultCitiesArray) isLoadingCitiesArray = false

    return (
        <View
            style={styles.container}
        >
            <ImageBackground
                style={styles.backgroundImage}
                source={backgroundImgSource}
                resizeMode={"cover"}
            >
                {
                    isShowLogo ?
                        <Image
                            style={styles.logo}
                            source={appImages.logo}
                            resizeMode={"contain"}
                        />
                        :
                        null
                }
                <View
                    style={styles.buttonSection}
                >
                    <DefaultButton
                        onPress={onPressPersonalInfo}
                        style={{...styles.button, ...styles.buttonProfile}}
                        title={personalInfoTitle}
                        imageSource={appImages.userActive}
                        containerStyle={styles.buttonContainerStyle}
                        titleStyle={{...styles.buttonTitle ,...styles.buttonProfileTitle}}
                        loading={isLoadingPersonalInfo}
                    />
                    <DefaultButton
                        onPress={() => navigation.navigate(routeNameConfig.appRoute.mapPage)}
                        style={styles.button}
                        title={'Выбрать адрес доставки'}
                        imageSource={appImages.geoEnter}
                        containerStyle={styles.buttonContainerStyle}
                        titleStyle={styles.buttonTitle}
                        loading={isLoadingCitiesArray}
                    />
                </View>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        alignItems: 'center'
    },
    button: {
        width: 270,
        paddingVertical: padding.big
    },
    buttonSection: {
        position: 'absolute',
        bottom: 30
    },
    buttonTitle: {
        width: 203,
        fontSize: fontSize.preMedium
    },
    buttonProfile: {
        backgroundColor: colors.defaultColor3,
    },
    buttonProfileTitle: {
        color: 'black'
    },
    buttonContainerStyle: {
        marginTop: 20
    },
    logo: {
        height: 170,
        marginVertical: 10
    }
})