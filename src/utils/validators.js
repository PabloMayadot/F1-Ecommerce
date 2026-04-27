/**
 * Verifica si un valor es una contraseña válida.
 * Requisitos: entre 6 y 12 caracteres, al menos una mayúscula, una minúscula y un dígito.
 */
export const isGoodPassword = (value) => {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,12}$/
    return regex.test(value)
}
