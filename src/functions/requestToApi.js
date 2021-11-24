import {expo} from "../../app.json";

function performFetchRequest (url, init) {

    const headers = {...init.headers, "appVersion": expo.version}

    return fetch(url, {
        ...init,
        headers: headers
    })
}

export async function makeApiRequest
(
    url,
    body = null,
    handleNetworkError = () => {},
    handleSuccess = () => {},
    handleError = () => {}
)
{

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)
    const returnedData = {
        isNetworkError: false,
        payload: {}
    }
    const init = {
        method: 'GET',
        signal: controller.signal
    }

    if (body !== null) {
        init['method'] = 'POST'
        init['body'] = JSON.stringify(body)
        init['headers'] = {'Content-Type': 'application/json'}
    }

    try {
        const response = await performFetchRequest(url, init)

        clearTimeout(timeoutId)
        returnedData.payload = await response.json()
    } catch (e) {
        returnedData.isNetworkError = true
    }

    handleRequestResponse(returnedData, handleNetworkError, handleSuccess, handleError)
}

function handleRequestResponse
(
    response,
    handleNetworkError = () => {},
    handleSuccess = () => {},
    handleError = () => {}
)
{

    const payload = response.payload

    if (response.isNetworkError) {
        handleNetworkError(getErrorTextIfServerNotAvailable())
    }
    else if (checkIsSuccessfulResponse(payload)) {
        handleSuccess(getPayloadFromResponse(payload))
    } else {
        handleError(getPayloadFromResponse(payload))
    }
}

export function getErrorTextIfServerNotAvailable() {
    return 'Приносим извинения, возникла ошибка, заказ можно сделать по телефону 211-10-10 с 10:00 - 23:00'
}

function checkIsSuccessfulResponse (json) {
    return json.success
}

function getPayloadFromResponse (json) {
    return json.payload
}

export function getPayloadErrorText (payload) {

    const errorText = payload[0]?.errorText

    return errorText ? errorText : getErrorTextIfServerNotAvailable()
}

export function handlePayloadError(payload, errorArray, defaultAction) {

    for (let i = 0; i < errorArray.length; i ++) {

        const errorCode = errorArray[i].errorCode
        const action = errorArray[i].action
        let errorIndex = null

        for (let j = 0; j < payload.length; j++) {
            if (errorCode === payload[j].errorCode) {
                errorIndex = j
                break
            }
        }

        if (errorIndex !== null) {
            const currentError = payload[errorIndex]

            action(currentError.payload, currentError.errorText)
            return
        }
    }

    defaultAction(payload)
}