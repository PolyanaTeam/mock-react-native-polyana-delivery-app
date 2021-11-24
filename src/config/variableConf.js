import {Platform} from "react-native";

const mainPath = ''
const serverURL = ''
const site = 'polyana'

export const appVariable = {
    isIOS: Platform.OS === 'ios',
    siteName: site,
    getCityUrl: `${serverURL}starting/`,
    getInitDataUrl: `${serverURL}starting/`,
    getRecommendationsUrl: `${serverURL}order/promo_recommendation`,
    checkOrderForm: `${serverURL}order/query`,
    createOrderUrl: `${serverURL}order/create`,
    logInUrl: `${serverURL}auth/login`,
    verifyUrl: `${serverURL}auth/verify`,
    checkSessionUrl: `${serverURL}auth/check`,
    updateProfileSettingsUrl: `${serverURL}auth/update`,
    usePromocodeUrl: `${serverURL}auth/promocode`,
    getStartBanner: `${serverURL}getAppStartBanner`,
    getOrders: `${serverURL}auth/orders`,
    dadataApiKey: '',
    privacyPolicyUrl: 'https://polyana.delivery/docs/PrivacyPolicyPolynaPolyanaDelivery.pdf',
    mapUrl: 'https://polyana.delivery/map/index.html',
    apiErrorCodes: {
        bonusesLack: 700,
        cityNotFound: 710
    },
    deliveryTypes: {
        delivery: "delivery",
        selfDelivery: "selfDelivery"
    },
    storageKeys: {
        jsession: 'jsession',
        addressObj: 'addressObj'
    }
}