export function editModifiersArray(childModifier, parentModifier, modifiers, setModifiers) {

    const productId = childModifier.id
    const productGroupId = parentModifier.id
    const checkAnswer = checkModifierInArrayModifiers(modifiers, productId, productGroupId)

    if (checkAnswer === null) {

        if (parentModifier.maxAmount === 1) deleteParentModifiers(modifiers, productGroupId)

        modifiers.push({
            productId: productId,
            amount: 1,
            productGroupId: productGroupId,
            price: childModifier.price,
            name: childModifier.name
        })
    }
    else modifiers.splice(checkAnswer, 1)

    setModifiers(JSON.parse(JSON.stringify(modifiers)))
}

function checkModifierInArrayModifiers (modifiers, productId, productGroupId) {
    for (let i = 0; i < modifiers.length; i++) {

        const modifier = modifiers[i]

        if (modifier.productId === productId && modifier.productGroupId === productGroupId) {
            return i
        }
    }

    return null
}

function deleteParentModifiers (modifiers, productGroupId) {
    modifiers.forEach((modifier, index) => {
        if (modifier.productGroupId === productGroupId) modifiers.splice(index, 1)
    })
}

export function getModifiersSum (modifiers) {

    let sum = 0

    modifiers.forEach(modifier => sum += modifier.price)

    return sum
}

export function checkNecessaryModifiers (dishModifiers, addedModifiers) {

    loop1: for (let i = 0; i < dishModifiers.length; i++) {

        const parentModifier = dishModifiers[i]
        const necessaryModifiers = []

        if (parentModifier.minAmount !== 1) continue

        parentModifier.childModifiers.forEach(childModifier => necessaryModifiers.push(childModifier.id))
        for (let modifier of addedModifiers) if (necessaryModifiers.includes(modifier.productId)) continue loop1

        return parentModifier.name
    }

    return null
}

export function sortModifiers (modifiers) {
    return modifiers.sort((a, b) => {
        if (a.productId > b.productId) return 1
        else if (a.productId < b.productId) return -1
        return 0
    })
}

export function compareModifiers(modifiers1, modifiers2) {

    for (let i = 0; i < modifiers1.length; i++)
        if (modifiers1[i].productId !== modifiers2[i].productId)
            return false

    return true
}

export function getSumModifiers(modifiers) {
    let sum = 0

    modifiers.forEach(modifier => sum += modifier.price)

    return sum
}

export function getStringModifiers(modifiers) {
    let answer = ""
    const length = modifiers.length - 1

    modifiers.forEach((modifier, index) => answer = `${answer}${modifier.name}${length !== index ? ", " : ""}`)

    return answer
}

export function isIncludeModifier (modifiers, productId, productGroupId) {
    for (let modifier of modifiers) {
        if (modifier.productId === productId && modifier.productGroupId === productGroupId)
            return true
    }

    return false
}