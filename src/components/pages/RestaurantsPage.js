import React from "react";
import {PageHorizontalSafeArea} from "../generics/PageHorizontalSafeArea";
import {RestaurantsGrid} from "../modules/RestaurantsPage/RestaurantsGrid";

export const RestaurantsPage = () => {
    return (
        <PageHorizontalSafeArea
            style={{flex: 1}}
        >
            <RestaurantsGrid/>
        </PageHorizontalSafeArea>
    )
}