import {appVariable} from "../config/variableConf";

export async function makeDadataRequest (url, query) {
    const token = appVariable.dadataApiKey;
    const options = {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Token " + token
        },
        body: JSON.stringify(query)
    }

    return await fetch(url, options)
}