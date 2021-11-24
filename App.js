import React, {useEffect, useState} from 'react'
import {initializeAsync, setAutoLogAppEventsEnabledAsync} from 'expo-facebook'
import {expo} from './app.json'
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "react-native-screens/native-stack";
import {routeNameConfig} from "./src/config/routeNamesConfig";
import {StartPage} from "./src/components/pages/StartPage";
import {Authorization1Page} from "./src/components/pages/Authorization1Page";
import {Authorization2Page} from "./src/components/pages/Authorization2Page";
import {MainPage} from "./src/components/pages/MainPage";
import {PersonalInfoContextProvider, usePersonalInfoContext} from "./src/context/personalInfo";
import {FormContextProvider, useFormContext} from "./src/context/form";
import {MapPage} from "./src/components/pages/MapPage";
import {OverlayContextProvider, useOverlayContext} from "./src/context/overlay";
import {OverlayModalWindow} from "./src/components/modules/common/Overlay";
import {CityContextProvider, useCityContext} from "./src/context/city";
import {handleCitiesFromServer} from "./src/functions/cityFunctions";
import {handlePersonalInfo} from "./src/functions/accauntFunctions";
import {handleAddressFromStorage} from "./src/functions/addressFunctions";
import {InitDataContextProvider} from "./src/context/initData";
import {BasketPage} from "./src/components/pages/BasketPage";
import {BasketContextProvider} from "./src/context/basket";
import {PayPage} from "./src/components/pages/PayPage";
import {appImages} from "./src/config/images";
import {appVariable} from "./src/config/variableConf";
import {CacheManager} from "react-native-expo-image-cache";
import {makeApiRequest} from "./src/functions/requestToApi";
import {SplashView} from "./src/components/modules/common/SplashView";
import {UpdateVersionView} from "./src/components/modules/common/UpdateVersionView";

const Stack = createNativeStackNavigator()

const App = () => {

    const [backgroundImgSourceObject, setBackgroundImgSourceObject] = useState(null)
    const [isVersionAvailable, setIsVersionAvailable] = useState(true)

    useEffect(() => {
        startAppHandler(setBackgroundImgSourceObject, setIsVersionAvailable)
    }, [])

    if (!isVersionAvailable) return <UpdateVersionView/>
    else if (backgroundImgSourceObject === null) return <SplashView/>

    return <AppContent backgroundImgSourceObject={backgroundImgSourceObject}/>
}

export default App

const AppContent = ({backgroundImgSourceObject}) => {

    const jsxNavigation =
        <NavigationContainer theme={{dark: false, colors:{background: "white"}}}>
            <Stack.Navigator initialRouteName={routeNameConfig.appRoute.startPage} screenOptions={{headerShown: false}}>
                <Stack.Screen name={routeNameConfig.appRoute.startPage}>
                    {
                        () => (
                            <StartPage
                                backgroundImgSource={backgroundImgSourceObject.path}
                                isShowLogo={backgroundImgSourceObject.isShowLogo}
                            />
                        )
                    }
                </Stack.Screen>
                <Stack.Screen name={routeNameConfig.appRoute.authorization1} component={Authorization1Page}/>
                <Stack.Screen name={routeNameConfig.appRoute.authorization2} component={Authorization2Page}/>
                <Stack.Screen name={routeNameConfig.appRoute.mapPage} component={MapPage}/>
                <Stack.Screen name={routeNameConfig.appRoute.mainPage} component={MainPage}/>
                <Stack.Screen name={routeNameConfig.appRoute.basketPage} component={BasketPage}/>
                <Stack.Screen name={routeNameConfig.appRoute.payPage} component={PayPage}/>
            </Stack.Navigator>
        </NavigationContainer>

    return (
        <OverlayContextProvider>
            <CityContextProvider>
                <PersonalInfoContextProvider>
                    <FormContextProvider>
                        <InitDataContextProvider>
                            <BasketContextProvider>
                                {/*get start data*/}
                                <StartingDataComponent/>
                                {/*navigation*/}
                                {jsxNavigation}
                            </BasketContextProvider>
                        </InitDataContextProvider>
                    </FormContextProvider>
                </PersonalInfoContextProvider>
            </CityContextProvider>
            <OverlayModalWindow/>
        </OverlayContextProvider>
    )
}

async function setFacebookMetric() {

    await initializeAsync({
        appId: expo.facebookAppId
    })
    await setAutoLogAppEventsEnabledAsync(true)
}

const StartingDataComponent = () => {

    const [{}, dispatchOverlay] = useOverlayContext()
    const [{}, dispatchCity] = useCityContext()
    const [{}, dispatchPersonalInfo] = usePersonalInfoContext()
    const [{}, dispatchForm] = useFormContext()

    useEffect( () => {
        handlePersonalInfo(dispatchPersonalInfo, dispatchForm)
        handleCitiesFromServer(dispatchOverlay, dispatchCity).then(cities => {
            if (cities) handleAddressFromStorage(dispatchForm, cities, dispatchCity)
        })
    }, [])

    return null
}

async function getStartBanner(setBackgroundImgSourceObject, setIsVersionAvailable) {

    let answer = {path: appImages.backgroundStartPage, isShowLogo: true}
    const handleNetworkError = () => {}
    const handleError = (payload) => {
        if (payload.isVersionAvailable === false) setIsVersionAvailable(false)
    }
    const handleSuccess = async (payload) => {
        const path = await CacheManager.get(payload.imgUrl)
        answer = {path: path, isShowLogo: false}
    }

    await makeApiRequest(appVariable.getStartBanner, null,
        handleNetworkError, handleSuccess, handleError)

    setBackgroundImgSourceObject(answer)
}

async function clearImgCache() {
    //clear img cache every 0 number
    if (Math.floor(Math.random() * 6) === 0) await CacheManager.clearCache()
}

async function startAppHandler (setBackgroundImgSourceObject, setIsVersionAvailable) {
    setFacebookMetric()
    await clearImgCache()
    getStartBanner(setBackgroundImgSourceObject, setIsVersionAvailable)
}