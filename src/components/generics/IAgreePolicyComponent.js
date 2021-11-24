import React from "react";
import {View, StyleSheet, Text, Image, Linking} from "react-native";
import {borderRadius, colors, fontSize} from "../../config/styleConf";
import {Button} from "react-native-elements";
import {appVariable} from "../../config/variableConf";
import {appImages} from "../../config/images";

export const IAgreePolicyComponent = () => {
    return (
        <View
            style={styles.container}
        >
            <View
                style={styles.view}
            >
                <Image
                    source={appImages.checkActive}
                    resizeMode="contain"
                    style={styles.image}
                />
                <Text
                    style={styles.text}
                >
                    {`Я  соглашаюсь на обработку\nперсональных данных`}
                </Text>
            </View>
            <Button
                containerStyle={styles.buttonContainerStyle}
                titleStyle={styles.buttonTitle}
                title={'Политика конфиденциальности и условия сервиса'}
                type={'clear'}
                onPress={() => Linking.openURL(appVariable.privacyPolicyUrl)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    view: {
        width: '100%',
        flexDirection: 'row',
        backgroundColor: colors.defaultColor4,
        padding: 10,
        borderRadius: borderRadius.medium,
    },
    text: {
        width: '100%',
        flexWrap: 'wrap',
        color: 'grey',
        fontSize: fontSize.small,
        textAlign: 'left'
    },
    image: {
        width: 25,
        height: '100%',
        marginRight: 10
    },
    buttonContainerStyle: {
        marginVertical: 15
    },
    buttonTitle: {
        color: 'grey'
    }
})