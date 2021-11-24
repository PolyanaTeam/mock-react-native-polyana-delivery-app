import React from "react";
import {useNavigation} from "@react-navigation/native";
import {PageSafeArea} from "./PageSafeArea";
import {DefaultHeader} from "./DefaultHeader";
import {HeaderBackButton} from "./HeaderBackButton";
import {PageHorizontalSafeArea} from "./PageHorizontalSafeArea";

export const BasketPageContainer = ({children, isHorizontalSafeArea = true}) => {

    const navigation = useNavigation()

    let jsx = children

    if (isHorizontalSafeArea)
        jsx =
            <PageHorizontalSafeArea
                style={{flex: 1}}
            >
                {children}
            </PageHorizontalSafeArea>

    return (
        <PageSafeArea>
            <DefaultHeader>
                <HeaderBackButton
                    navigation={navigation}
                />
            </DefaultHeader>
            {jsx}
        </PageSafeArea>
    )
}