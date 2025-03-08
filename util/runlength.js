//input is b64 so doesnt contain specials.
const charMap = [
    'á',
    'é',
    'í',
    'ó',
    'ú',
    'ü',
    'ñ',
    'ç',
    '¿',
    '¡'
]
//En
function ENum(num) {
    let encoded = ''
    for (let digit of num.toString()) {
        encoded += charMap[parseInt(digit)]
    }
    return encoded
}
//De
function DNum(encoded) {
    let decoded = ''
    for (let char of encoded) {
        decoded += charMap.indexOf(char)
    }
    return decoded
}
//V2
export function encodeSafe(str) {
    var count = 0
    var typ = ""
    var out = ""
    str.split("").forEach((char) => {
        if (char != typ && typ != "") {
            if (count > 2) {
                out += ENum(count) + typ
            } else {
                out += typ.repeat(count)
            }
            count = 0
        }
        typ = char
        count++
    })
    if (typ != "" && count > 0) {
        if (count > 2) {
            out += ENum(count) + typ
        } else {
            out += typ.repeat(count)
        }
    }
    if (decodeSafe(out) == str) {
        return out
    }
}
export function decodeSafe(str) {
    var count = ""
    var out = ""
    str.split("").forEach((char) => {
        if (charMap.includes(char)) {
            count += char
        } else {
            if (count == "") {
                out += char
            } else {
                out += char.repeat(DNum(count))
                count = ""
            }
        }
    })
    return out
}