import React, {useState} from "react";
import {PageSafeArea} from "../generics/PageSafeArea";
import {PageHorizontalSafeArea} from "../generics/PageHorizontalSafeArea";
import {DefaultHeader} from "../generics/DefaultHeader";
import {HeaderBackButton} from "../generics/HeaderBackButton";
import {useNavigation} from "@react-navigation/native";
import {routeNameConfig} from "../../config/routeNamesConfig";
import WebView from "react-native-webview";
import {ActivityIndicator, View, StyleSheet} from "react-native";
import {colors} from "../../config/styleConf";

export const PayPage = ({route}) => {

    const navigation = useNavigation()
    const [visible, setVisible] = useState(true)
    const src = route.params.params.src

    return (
        <PageSafeArea>
            <DefaultHeader>
                <HeaderBackButton
                    navigation={navigation}
                    routeName={routeNameConfig.appRoute.mainPage}
                />
            </DefaultHeader>
            <PageHorizontalSafeArea
                style={styles.fillScreen}
            >
                <View
                    style={styles.fillScreen}
                >
                    <WebView
                        source={{uri: src}}
                        style={styles.fillScreen}
                        onLoadStart={()=>setVisible(true)}
                        onLoad={()=>setVisible(false)}
                    />
                    {
                        visible && (
                            <View
                                style={styles.indicatorSection}
                            >
                                <ActivityIndicator size='large' color={colors.defaultColor}/>
                            </View>
                        )
                    }
                </View>
            </PageHorizontalSafeArea>
        </PageSafeArea>
    )
}

const styles = StyleSheet.create({
    fillScreen: {
        flex: 1
    },
    indicatorSection: {
        width: '100%',
        height: '100%',
        position: "absolute",
        justifyContent: 'center'
    }
})