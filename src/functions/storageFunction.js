import AsyncStorage from "@react-native-async-storage/async-storage"

export async function getItemFromStorage(key) {
    try {
        return await AsyncStorage.getItem(key)
    } catch (e) {}

    return null
}

export async function removeItemFromStorage(key) {
    try {
        await AsyncStorage.removeItem(key);
        return true;
    }
    catch(exception) {
        return false;
    }
}

export function setItemToStorage(key, value) {
    try {
        AsyncStorage.setItem(key, value)
    } catch (e) {}
}