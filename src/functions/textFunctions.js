export function testPhoneIsValid (phone) {
    const phoneRegExp = /^(\+7)(9)\d{9}$/

    return phoneRegExp.test(phone)
}

export function handlePhone(phone) {
    return phone.substring(0, 1) === '8' ? `+7${phone.substring(1)}` : phone
}

export function checkLengthPhone (value, action) {
    if (value.length <= 12) action(value)
}